import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/api/services/base-service';
import { MenuOrder, MenuOrderDocument } from '../schemas/menu-order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IExtraOptions } from 'src/base/api/services/base.interface';
import { MenuService } from './menu.service';
import { DishService } from './dish.service';
import { MenuDocument } from '../schemas/menu.schema';
import { DishDocument } from '../schemas/dish.schema';

@Injectable()
export class MenuOrderService extends BaseService<MenuOrderDocument> {
  constructor(
    @InjectModel(MenuOrder.name) protected readonly model: Model<MenuOrderDocument>,
    private readonly menuService: MenuService,
    private readonly dishService: DishService,
  ) {
    super(model);
  }

  protected override async preCreate(
    dto: Partial<MenuOrderDocument>,
    extraOptions?: IExtraOptions,
  ) {
    const menu: MenuDocument = await this.menuService.getById(dto.menuId);
    const dish: DishDocument = await this.dishService.getById(dto.dishId);

    dto.priceAtOrder = dish.originalPrice;

    menu.orderedCount += dto.quantity;
    dish.orderedQuantity += dto.quantity;

    menu.save();
    dish.save();

    return super.preCreate(dto, extraOptions);
  }
}
