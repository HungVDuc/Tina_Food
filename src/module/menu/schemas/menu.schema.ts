import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/base/model/base.schema';
import { MenuStatus } from '../enums/menu.enum';

@Schema({ timestamps: true })
export class Menu extends BaseSchema {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  photoPath: string;

  @Prop({ required: true, type: [String] })
  photoPaths: string[];

  @Prop({ required: false, type: String })
  note?: string;

  @Prop({ required: true, enum: MenuStatus, default: MenuStatus.OPENING })
  status: MenuStatus;

  @Prop({ required: true, type: Number, default: 0 })
  orderedCount: number;

  @Prop({ required: true, type: Date, default: Date.now })
  timeFrom: Date;

  @Prop({ required: true, type: Date })
  timeTo: Date;

  @Prop({ required: true, type: Boolean, default: false })
  allowAddDish: boolean;

  @Prop({ required: true, type: Number, default: 0 })
  shippingFee: number;

  @Prop({ required: true, type: Number, default: 0 })
  discount: number;

  @Prop({ required: false, type: String })
  refLink?: string;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
export type MenuDocument = HydratedDocument<Menu>;
