// analytics.service.ts
import { Injectable } from '@nestjs/common';
import { CreateAnalyicDto } from './dto/create-analytic.dto';
import { UpdateAnalyicDto } from './dto/update-analytic.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Analytics } from './entities/analytic.entity';
import { Model } from 'mongoose';
import * as useragent from 'express-useragent';
import * as geoip from 'geoip-lite';
import { Request } from 'express';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name) private analyticsModel: Model<Analytics>
  ) { }

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
          url: urlId,
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