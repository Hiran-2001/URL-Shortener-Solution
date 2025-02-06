import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, NotFoundException, Res, Req } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { AnalyticsService } from 'src/analyics/analytics.service';
import { Response, Request } from 'express';


@Controller('api')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Post('shorten')
  @HttpCode(HttpStatus.CREATED)
  async createShortUrl(@Body() createUrlDto: CreateUrlDto) {
    const { longUrl, customAlias, topic } = createUrlDto;
    const url = await this.urlService.createShortUrl(longUrl, customAlias, topic);
    return {
      shortUrl: url?.shortUrl, // Return the full short URL
      createdAt: url?.createdAt,
    };
  }

  @Get('shorten/:alias')
  async redirectToUrl(
    @Param('alias') alias: string,
    @Res() res: Response,
    @Req() req: Request,
  ){
    try {
      
      const url = await this.urlService.findByAlias(alias);      
      this.analyticsService.trackVisit(url._id, req).catch(err => {
        console.error('Failed to track visit:', err);
      });
      return res.redirect(301, url.longUrl);
    } catch (error) {
      console.log(error);
      
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: 'URL not found' });
      } else {
        return res.status(500).send({ message: 'Internal server error' });
      }
    }
  }
}
