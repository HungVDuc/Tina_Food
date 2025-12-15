import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtGuard } from 'src/base/authorization/jwt.guard';
import { UserAuth } from 'src/base/authorization/authorization.decorator';
import { AccessTokenPayload } from 'src/base/authorization/jwt.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async listPaginated(@Query() query: any) {
    return this.userService.listPaginate(query);
  }

  @Get('info')
  async getInfoMe(@UserAuth() user: AccessTokenPayload) {
    return this.userService.getOne({ userName: user.userName });
  }
}
