import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { MenuService } from './services/menu.service';
import { UserMenuController } from './controllers/user-menu.controller';
import { Dish, DishSchema } from './schemas/dish.schema';
import { DishService } from './services/dish.service';
import { UserDishController } from './controllers/user-dish.controller';
import { MenuOrder, MenuOrderSchema } from './schemas/menu-order.schema';
import { MenuOrderService } from './services/menu-order.service';
import { UserMenuOrderController } from './controllers/user-menu-order.controller';
import { UserImageController } from './controllers/user-image.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Menu.name, schema: MenuSchema },
      { name: Dish.name, schema: DishSchema },
      { name: MenuOrder.name, schema: MenuOrderSchema },
    ]),
  ],
  controllers: [
    UserMenuController,
    UserDishController,
    UserMenuOrderController,
    UserImageController,
  ],
  providers: [MenuService, DishService, MenuOrderService],
})
export class MenuModule {}
