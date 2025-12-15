import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole, UserStatus } from '../enums/user.enum';

@Schema({ timestamps: true })
export class User {
  id: string;

  @Prop({ required: false, type: String })
  nameDisplay?: string;

  @Prop({ required: true, type: String })
  userName: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: String })
  avatarPath?: string;

  @Prop({ required: false, type: String })
  backgroundImg?: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ required: true, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ required: true, type: Number, default: 0 })
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
