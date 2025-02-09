import { UpdateUrlDto } from './dto/update-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './entities/url.entity';
import { Model } from 'mongoose';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async createShortUrl(longUrl: string, customAlias?: string, topic?: string) {
    try {

      if (customAlias) {
        const existingUrl = await this.urlModel.findOne({ alias: customAlias });
        if (existingUrl) {
          throw new ConflictException('Custom alias is already in use');
        }
      }

      const alias = customAlias || this.generateAlias();
      const url = new this.urlModel({
        longUrl,
        shortUrl: `http://54.253.241.58:5000/api/shorten/${alias}`,
        createdAt: new Date(),
        alias: alias,
        topic: topic,
      });

      await url.save();

      await this.cacheManager.set(alias, url)
      return url;
    } catch (error) {
      throw error
    }

  }

  async findByAlias(alias: string) : Promise<any>{
    try {
      const cachedUrl = await this.cacheManager.get(alias);
      if(cachedUrl){
        return cachedUrl
      }

      const existingUrl = await this.urlModel.findOne({ alias: alias });

      if (!existingUrl) {
        throw new NotFoundException('URL not found');
      }

      await this.cacheManager.set(alias, existingUrl);

      return existingUrl;
    } catch (error) {
      throw error
    }

  }

  private generateAlias(): string {
    return uuidv4().slice(0, 8);
  }
}
