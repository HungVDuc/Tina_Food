import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/api/services/base-service';
import { Dish, DishDocument } from '../schemas/dish.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IExtraOptions } from 'src/base/api/services/base.interface';
import { MenuService } from './menu.service';
import { Menu } from '../schemas/menu.schema';

@Injectable()
export class DishService extends BaseService<DishDocument> {
  constructor(
    @InjectModel(Dish.name) protected readonly model: Model<DishDocument>,
    private readonly menuService: MenuService,
  ) {
    super(model);
  }

  protected override async preCreate(dto: Partial<DishDocument>, extraOptions?: IExtraOptions) {
    const menu: Menu = await this.menuService.getById(dto.menuId);
    if (!menu.allowAddDish) {
      const isAllow = extraOptions.user.id === menu.createdBy.id.toString();

      if (!isAllow) throw new ForbiddenException('Do not have permission create dish');
    }

    return super.preCreate(dto, extraOptions);
  }
}
