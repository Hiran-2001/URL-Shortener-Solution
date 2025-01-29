import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [PassportModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService,GoogleStrategy],
})
export class GoogleAuthModule {}
