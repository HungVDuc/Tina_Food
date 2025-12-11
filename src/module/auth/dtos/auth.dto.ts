import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class AuthDto {
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
}

export class LoginDto extends AuthDto {}

export class RegisterDto extends AuthDto {
  @ApiPropertyOptional({
    example: 'hung.vd1',
    description: 'Tên hiển thị',
  })
  @IsOptional()
  @IsString()
  nameDisplay?: string;

  @ApiPropertyOptional({
    example: 'http://avatar.png',
    description: 'Link ảnh',
  })
  @IsOptional()
  @IsString()
  avatarPath?: string;
}
