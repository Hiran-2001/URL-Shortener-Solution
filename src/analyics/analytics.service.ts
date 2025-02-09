// analytics.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name) private analyticsModel: Model<Analytics>,
    @InjectModel(Url.name) private urlModel: Model<Url>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }


  async getUrlAnalytics(alias: string) {
    const cacheKey = `analytics:url:${alias}`;
    const cachedAnalytics = await this.cacheManager.get(cacheKey);
    if (cachedAnalytics) {      
      return cachedAnalytics;
    }

    const url = await this.urlModel.findOne({ alias });
    if (!url) {
      throw new NotFoundException('URL not found');
    }

    const analytics = await this.analyticsModel.find({ url: url._id });
    const sevenDaysAgo = moment().subtract(7, 'days').startOf('day');


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



    const analyticsData = {
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType: osStats,
      deviceType: deviceStats
    };
 
    await this.cacheManager.set(cacheKey, analyticsData);
    
    return analyticsData;
  }



  async getTopicAnalytics(topic: string) {
    const cacheKey = `analytics:topic:${topic}`;
    const cachedAnalytics = await this.cacheManager.get(cacheKey);
    if (cachedAnalytics) {      
      return cachedAnalytics;
    }
    const urls = await this.urlModel.find({ topic });
    const urlIds = urls.map(url => url._id.toString());




    const analytics = await this.analyticsModel.find({ url: { $in: urlIds } });
    const totalClicks = analytics.length;
    const uniqueUsers = new Set(analytics.map(a => a.ipAddress)).size;

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

    const urlStats = await Promise.all(urls.map(async url => {
      const urlAnalytics = analytics.filter(a => a.url.toString() === url._id.toString());
      return {
        shortUrl: url.shortUrl,
        totalClicks: urlAnalytics.length,
        uniqueUsers: new Set(urlAnalytics.map(a => a.ipAddress)).size
      };
    }));

    const analyticsData = {
      totalClicks,
      uniqueUsers,
      clicksByDate,
      urls: urlStats
    };
    await this.cacheManager.set(cacheKey, analyticsData);
    
    return analyticsData;
  }

  async getOverallAnalytics() {
    const cacheKey = `analytics:overall`;

    const cachedAnalytics = await this.cacheManager.get(cacheKey);
    if (cachedAnalytics) {      
      return cachedAnalytics;
    }
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



    const analyticsData = {
      totalUrls,
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType: osStats,
      deviceType: deviceStats
    };

    await this.cacheManager.set(cacheKey, analyticsData);
    
    return analyticsData;
  }

  async trackVisit(urlId: any, req: Request) {
    try {
      const ipAddress = this.getIPAddress(req) || '3.26.210.70';

      const geo = geoip.lookup(ipAddress);

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