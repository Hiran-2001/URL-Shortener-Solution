import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as useragent from 'express-useragent';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger:['log', 'error', 'warn', 'debug', 'verbose']
  });

  app.use(useragent.express()); 

  app.use((req: Request, res: any, next: any) => {
    next();
  });
  await app.listen(5000, '0.0.0.0');
  console.log('Server running or port 5000');
  
}
bootstrap();
