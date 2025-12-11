import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/module/user/services/user.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { JwtAuthService } from 'src/base/authorization/jwt.service';
import { User } from 'src/module/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async register(dto: RegisterDto) {
    return this.userService.create(dto);
  }

  async login(dto: LoginDto) {
    const user: User = await this.userService.findOneBy({ userName: dto.userName });
    if (!user) throw new UnauthorizedException('Username not exist');

    const isAuthorized = await bcrypt.compare(dto.password, user.password);
    if (!isAuthorized) throw new UnauthorizedException('Wrong password');
    return this.jwtAuthService.createAccessToken({
      userName: user.userName,
      role: user.role,
      status: user.status,
    });
  }
}
