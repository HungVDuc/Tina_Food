import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtGuard } from 'src/base/authorization/jwt.guard';
import { UserAuth } from 'src/base/authorization/authorization.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';
import { UpdateUserDto, UserListQueryDto } from '../dtos/user.dto';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    example: 'hung',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    example: '{"role": "ADMIN","status":"ACTIVE"}',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    example: '-createdAt,role,status',
  })
  @Get()
  async listPaginated(@Query() query: UserListQueryDto) {
    return this.userService.listPaginate(query);
  }

  @Get('info')
  async getInfoMe(@UserAuth() user: User) {
    return this.userService.getOne({ userName: user.userName });
  }

  @Patch()
  async update(@UserAuth() user: User, @Body() dto: UpdateUserDto) {
    return this.userService.updateById(user.id, dto);
  }
}
