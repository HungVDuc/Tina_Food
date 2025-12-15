import { Prop, Schema as NSchema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';
import { BaseSchema } from 'src/base/model/base.schema';

@NSchema()
export class MenuOrder extends BaseSchema {
  @Prop({ required: true, type: Schema.Types.ObjectId, ref: 'Menu' })
  menuId: string;

  @Prop({ required: true, type: Schema.Types.ObjectId, ref: 'Dish' })
  dishId: string;

  @Prop({ required: true, type: Number, default: 1 })
  quantity: number;

  @Prop({ required: true, type: Number })
  priceAtOrder: number;

  @Prop({ required: true, type: Number, default: 0 })
  paidAmount: number;

  @Prop({ required: true, type: Number, default: 0 })
  tipAmount: number;

  @Prop({ type: String })
  note?: string;
}

export const MenuOrderSchema = SchemaFactory.createForClass(MenuOrder);
export type MenuOrderDocument = HydratedDocument<MenuOrder>;
