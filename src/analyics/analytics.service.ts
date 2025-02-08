// analytics.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnalyicDto } from './dto/create-analytic.dto';
import { UpdateAnalyicDto } from './dto/update-analytic.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Analytics } from './entities/analytic.entity';
import { Model } from 'mongoose';
import * as useragent from 'express-useragent';
import * as geoip from 'geoip-lite';
import { Request } from 'express';
import { Url } from 'src/url/entities/url.entity';
import * as moment from 'moment';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name) private analyticsModel: Model<Analytics>,
    @InjectModel(Url.name) private urlModel: Model<Url>
  ) { }


  async getUrlAnalytics(alias: string) {
    const url = await this.urlModel.findOne({ alias });
    if (!url) {
      throw new NotFoundException('URL not found');
    }

    const analytics = await this.analyticsModel.find({ url: url._id });
    const sevenDaysAgo = moment().subtract(7, 'days').startOf('day');
    

    // Calculate basic metrics
    const totalClicks = analytics.length;
    const uniqueUsers = new Set(analytics.map(a => a.ipAddress)).size;

    const clicksByDate = await this.analyticsModel.aggregate([
      {
        $match: {
          url: url._id.toString(),
          timestamp: { $gte: sevenDaysAgo.toDate() }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    console.log(clicksByDate,"clickByDate");
    

    // // Calculate OS statistics
    const osStats = await (await this.analyticsModel.aggregate([
      {
        $match: { url: url._id.toString() }
      },
      {
        $group: {
          _id: "$userAgent.os",
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: "$ipAddress" }
        }
      }
    ])).map(stat => ({
      osName: stat._id || 'Unknown',
      uniqueClicks: stat.uniqueClicks,
      uniqueUsers: stat.uniqueUsers.length
    }));


    const deviceStats = await (await this.analyticsModel.aggregate([
      {
        $match: { url: url._id.toString() }
      },
      {
        $addFields: {
          deviceType: {
            $cond: {
              if: { $regexMatch: { input: "$userAgent.source", regex: /mobile|android|iphone/i } },
              then: "mobile",
              else: "desktop"
            }
          }
        }
      },
      {
        $group: {
          _id: "$deviceType",
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: "$ipAddress" }
        }
      }
    ])).map(stat => ({
      deviceName: stat._id,
      uniqueClicks: stat.uniqueClicks,
      uniqueUsers: stat.uniqueUsers.length
    }));

    // console.log(deviceStats,"deviceStats");


    return {
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType: osStats,
      deviceType: deviceStats
    };
  }



  async getTopicAnalytics(topic: string) {
    const urls = await this.urlModel.find({ topic });
    const urlIds = urls.map(url => url._id.toString());

    console.log(urlIds,"idssssss");
    
    

    const analytics = await this.analyticsModel.find({ url: { $in: urlIds } });
    const totalClicks = analytics.length;
    const uniqueUsers = new Set(analytics.map(a => a.ipAddress)).size;

    // Calculate clicks by date
    const clicksByDate = await this.analyticsModel.aggregate([
      {
        $match: { url: { $in: urlIds } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get per-URL statistics
    const urlStats = await Promise.all(urls.map(async url => {
      const urlAnalytics = analytics.filter(a => a.url.toString() === url._id.toString());
      return {
        shortUrl: url.shortUrl,
        totalClicks: urlAnalytics.length,
        uniqueUsers: new Set(urlAnalytics.map(a => a.ipAddress)).size
      };
    }));

    return {
      totalClicks,
      uniqueUsers,
      clicksByDate,
      urls: urlStats
    };
  }

  async getOverallAnalytics() {
    console.log("in overall analytics");
    
    const analytics = await this.analyticsModel.find();
    const totalUrls = await this.urlModel.countDocuments();
    const totalClicks = analytics.length;
    const uniqueUsers = new Set(analytics.map(a => a.ipAddress)).size;

    // Calculate clicks by date
    const clicksByDate = await this.analyticsModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log(clicksByDate,"click by date");
    

    // Calculate OS statistics
    const osStats = await (await this.analyticsModel.aggregate([
      {
        $group: {
          _id: "$userAgent.os",
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: "$ipAddress" }
        }
      }
    ])).map(stat => ({
      osName: stat._id || 'Unknown',
      uniqueClicks: stat.uniqueClicks,
      uniqueUsers: stat.uniqueUsers.length
    }));

    console.log(osStats,"osStats");


    // Calculate device type statistics
    const deviceStats = await (await this.analyticsModel.aggregate([
      {
        $addFields: {
          deviceType: {
            $cond: {
              if: { $regexMatch: { input: "$userAgent.source", regex: /mobile|android|iphone/i } },
              then: "mobile",
              else: "desktop"
            }
          }
        }
      },
      {
        $group: {
          _id: "$deviceType",
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: "$ipAddress" }
        }
      }
    ])).map(stat => ({
      deviceName: stat._id,
      uniqueClicks: stat.uniqueClicks,
      uniqueUsers: stat.uniqueUsers.length
    }));

    console.log(deviceStats,"device stats");


    return {
      totalUrls,
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType: osStats,
      deviceType: deviceStats
    };
  }

  async trackVisit(urlId: any, req: Request) {
    try {
      const ipAddress = this.getIPAddress(req) || '3.26.210.70' ;
      console.log("IP Address:", ipAddress);

      const geo = geoip.lookup(ipAddress);
      console.log("Geo Location:", geo);

      console.log(req.useragent?.source);
      
      const geolocation = geo
      ? {
          country: geo?.country || "Unknown", // Provide default values
          region: geo?.region || "Unknown",
          city: geo?.city || "Unknown",
          latitude: geo?.ll?.[0] || 0,
          longitude: geo?.ll?.[1] || 0,
        }
      : { // Default geolocation object if geo is null
          country: "Unknown",
          region: "Unknown",
          city: "Unknown",
          latitude: 0,
          longitude: 0,
        };

        const userAgent = req.useragent ? {
          browser: req.useragent.browser,
          os: req.useragent.os,
          source: req.useragent.source,
        } : null;

        const newVisit = new this.analyticsModel({
          url: urlId.toString(),
          timestamp: new Date(),
          userAgent: userAgent,
          ipAddress,
          geolocation,
        });

        const savedVisit = await newVisit.save();
        console.log("Saved Visit:", savedVisit);
  
        return savedVisit;
    } catch (error) {
      console.error('Error tracking visit:', error);
      return null;
    }
  }

  private getIPAddress(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'] as string;
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    } else if (req.connection && req.connection.remoteAddress) {
      const ip = req.connection.remoteAddress;
      return this.extractIPv4FromIPv6(ip);
    } else if (req.socket && req.socket.remoteAddress) {
      const ip = req.socket.remoteAddress;
      return this.extractIPv4FromIPv6(ip);
    }
    return req.ip; // Fallback (less reliable)
  }

  private extractIPv4FromIPv6(ip: string): string {
    if (ip.startsWith('::ffff:')) {
      return ip.substring(7);
    }
    return ip;
  }

}