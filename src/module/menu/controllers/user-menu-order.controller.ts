import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MenuOrderService } from '../services/menu-order.service';
import { JwtGuard } from 'src/base/authorization/jwt.guard';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MongoIdDto } from 'src/base/api/dtos/common.dto';
import { UserAuth } from 'src/base/authorization/authorization.decorator';
import { User } from 'src/module/user/schemas/user.schema';
import {
  MenuOrderListQueryDto,
  UserCreateMenuOrderDto,
  UserUpdateMenuOrderDto,
} from '../dtos/user-menu-order.dto';
import {
  AddCreatedByToBody,
  AddUpdatedByToBody,
} from 'src/base/api/decorators/add-user-to-body.decorator';

@ApiTags('MenuOrder/ User')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('menu-order')
export class UserMenuOrderController {
  constructor(private readonly menuOrderService: MenuOrderService) {}

  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    example: '{"dishId": "693a70a15009c56bbc58a99e"}',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    example: '-createdAt,quantity',
  })
  @Get()
  async listPaginated(@UserAuth() user: User, @Query() query: MenuOrderListQueryDto) {
    return this.menuOrderService.listPaginate(query);
  }

  @Post()
  async create(@UserAuth() user: User, @AddCreatedByToBody() @Body() dto: UserCreateMenuOrderDto) {
    return this.menuOrderService.create(dto);
  }

  @ApiParam({ name: 'id', type: String, description: 'Menu Order ID' })
  @Patch(':id')
  async update(
    @Param() param: MongoIdDto,
    @AddUpdatedByToBody() @Body() dto: UserUpdateMenuOrderDto,
  ) {
    return this.menuOrderService.updateById(param.id, dto);
  }
}
