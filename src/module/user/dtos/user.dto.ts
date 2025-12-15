import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole, UserStatus } from '../enums/user.enum';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { factorySpectificationQueryDto } from 'src/base/api/dtos';

export class User {
  @ApiProperty({
    example: 'Vũ Đức Hùng',
    description: 'Tên hiển thị',
  })
  @IsOptional()
  @IsString()
  nameDisplay?: string;

  @ApiProperty({
    example: 'hungvd',
    description: 'Tên tài khoản',
  })
  @IsString()
  userName: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu người dùng',
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    example: 'http://avatar.png',
    description: 'Link ảnh đại diện',
  })
  @IsOptional()
  @IsString()
  avatarPath?: string;

  @ApiPropertyOptional({
    example: 'http://background.png',
    description: 'Link ảnh nền',
  })
  @IsOptional()
  @IsString()
  backgroundImg?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiHideProperty()
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  //   @IsNumber()
  //   balance?: number;
}

class UserFilter extends PartialType(PickType(User, ['role', 'status'])) {}

export class UserListQueryDto extends factorySpectificationQueryDto<UserFilter>({
  filterCls: UserFilter,
  sortFields: ['createdAt', 'role', 'status'],
  searchFields: ['nameDisplay', 'userName'],
}) {}

export class UpdateUserDto extends PartialType(
  PickType(User, ['nameDisplay', 'avatarPath', 'backgroundImg', 'password']),
) {}
