import { Prop, Schema as NSchema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';
import { BaseSchema } from 'src/base/model/base.schema';
import { MenuSize } from '../enums/menu.enum';

@NSchema({ timestamps: true })
export class Dish extends BaseSchema {
  @Prop({ required: true, type: Schema.Types.ObjectId, ref: 'Menu' })
  menuId: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, enum: MenuSize, default: MenuSize.ONE_SIZE })
  size: MenuSize;

  @Prop({ required: true, type: Number })
  originalPrice: number;

  @Prop({ required: true, type: Number, default: 0 })
  orderedQuantity: number;
}

export const DishSchema = SchemaFactory.createForClass(Dish);
export type DishDocument = HydratedDocument<Dish>;
