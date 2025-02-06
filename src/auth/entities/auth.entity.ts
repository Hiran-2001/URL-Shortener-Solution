import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';


@Schema()
export class Auth {

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  googleId: string;

  @Prop()
  profileImage: string;

}

export const AuthSchema = SchemaFactory.createForClass(Auth);