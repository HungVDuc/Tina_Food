import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop()
  nameDisplay: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  avatarPath: string;

  @Prop()
  role: string;

  @Prop()
  status: string;

  @Prop()
  balance: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserModel = HydratedDocument<User>;
