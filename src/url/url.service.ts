import { UpdateUrlDto } from './dto/update-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './entities/url.entity';
import { Model } from 'mongoose';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<Url>) { }

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
        shortUrl: `http://localhost:5000/api/shorten/${alias}`,
        createdAt: new Date(),
        alias: alias,
        topic: topic,
      });

      return url.save();
    } catch (error) {
      throw error
    }

  }

  async findByAlias(alias: string) {


    try {
      const existingUrl = await this.urlModel.findOne({ alias: alias });

      if (!existingUrl) {
        throw new NotFoundException('URL not found');
      }

      return existingUrl;
    } catch (error) {
      throw error
    }

  }

  private generateAlias(): string {
    return uuidv4().slice(0, 8); // Generates a random 8-character string
  }
}
