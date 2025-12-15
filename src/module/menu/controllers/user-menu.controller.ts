import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/base/authorization/jwt.guard';
import { MenuService } from '../services/menu.service';
import { UserAuth } from 'src/base/authorization/authorization.decorator';
import { MenuListQueryDto, UserCreateMenuDto, UserUpdateMenuDto } from '../dtos/user-menu.dto';
import {
  AddCreatedByToBody,
  AddUpdatedByToBody,
} from 'src/base/api/decorators/add-user-to-body.decorator';
import { MongoIdDto } from 'src/base/api/dtos/common.dto';
import { User } from 'src/module/user/schemas/user.schema';

@ApiTags('Menu/ User')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('menu')
export class UserMenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    example:
      '{"status_in": ["CANCELLED", "OPENING"], "createdAt_range": ["2025-12-04T17:00:00.000Z","2025-12-09T16:59:59.999Z"]}',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    example: '-createdAt',
  })
  @Get()
  async listPagined(@Query() query: MenuListQueryDto) {
    return this.menuService.listPaginate(query);
  }

  @Post()
  async create(@UserAuth() user: User, @AddCreatedByToBody() @Body() dto: UserCreateMenuDto) {
    return this.menuService.create(dto);
  }

  @ApiParam({ name: 'id', type: String, description: 'Menu ID' })
  @Patch(':id')
  async update(@Param() param: MongoIdDto, @AddUpdatedByToBody() @Body() dto: UserUpdateMenuDto) {
    return this.menuService.updateById(param.id, dto);
  }
}
