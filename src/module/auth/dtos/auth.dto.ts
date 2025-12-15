import { PickType } from '@nestjs/swagger';
import { User as UserDto } from 'src/module/user/dtos/user.dto';

export class LoginDto extends PickType(UserDto, ['userName', 'password']) {}

export class RegisterDto extends PickType(UserDto, [
  'userName',
  'password',
  'nameDisplay',
  'avatarPath',
  'backgroundImg',
]) {}
