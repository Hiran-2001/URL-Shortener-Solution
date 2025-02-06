import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private userModel: Model<Auth>,
    private readonly jwtService: JwtService,
  ) { }

  async validateOrCreateUser(profile: any): Promise<Auth> {
    try {
      if (!profile || !profile.emails || !profile.emails.length) {
        throw new Error('Invalid profile data');
      }

      const { id, displayName, emails } = profile;
      const email = emails[0].value;

      let user = await this.findByEmail(email);

      if (!user) {
        user = await this.create({
          googleId: id,
          name: displayName,
          email,
        });
      }

      return user;
    } catch (error) {
      console.error('Error in validateOrCreateUser:', error);
      throw error;
    }
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
  async findByEmail(email: string): Promise<Auth | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: Partial<Auth>): Promise<Auth> {
    const user = new this.userModel(userData);
    return user.save();
  }
}
