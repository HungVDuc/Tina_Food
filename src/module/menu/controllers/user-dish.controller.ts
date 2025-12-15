import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DishService } from '../services/dish.service';
import { JwtGuard } from 'src/base/authorization/jwt.guard';
import { DistListQueryDto, UserCreateDishDto, UserUpdateDishDto } from '../dtos/user-dish.dto';
import { UserAuth } from 'src/base/authorization/authorization.decorator';
import { User } from 'src/module/user/schemas/user.schema';
import { MongoIdDto } from 'src/base/api/dtos/common.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Dish/ User')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('dish')
export class UserDishController {
  constructor(private readonly dishService: DishService) {}

  @Get()
  async listPaginated(@Query() query: DistListQueryDto) {
    return this.dishService.listPaginate(query);
  }

  @Post()
  async create(@UserAuth() user: User, @Body() dto: UserCreateDishDto) {
    return this.dishService.create(dto, { user });
  }

  @ApiParam({ name: 'id', type: String, description: 'Dish ID' })
  @Patch(':id')
  async update(@Param() param: MongoIdDto, @Body() dto: UserUpdateDishDto) {
    return this.dishService.updateById(param.id, dto);
  }
}
