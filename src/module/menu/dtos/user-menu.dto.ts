import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { HideCreatedByDto } from 'src/base/api/dtos/common-hide-property';
import { MenuStatus } from '../enums/menu.enum';
import { Type } from 'class-transformer';
import { factorySpectificationQueryDto } from 'src/base/api/dtos';

class Menu extends HideCreatedByDto {
  @ApiProperty({
    example: 'Bữa trưa',
    description: 'Tên menu',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'http://image.png',
    description: 'Ảnh đại diện của menu',
  })
  @IsString()
  photoPath: string;

  @ApiProperty({
    type: [String],
    example: ['http://image1.png', 'http://image2.png'],
  })
  @IsArray()
  @IsString({ each: true })
  photoPaths: string[];

  @ApiPropertyOptional({
    example: 'Note nè',
    description: 'Note',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    enum: MenuStatus,
    example: MenuStatus.CANCELLED,
  })
  @IsOptional()
  @IsEnum(MenuStatus)
  status?: MenuStatus;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  orderedCount?: number;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2025-01-20T08:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timeFrom?: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-01-20T08:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  timeTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowAddDish?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  shippingFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refLink?: string;
}

export class MenuFilterDto extends PartialType(PickType(Menu, ['status'])) {
  @IsOptional()
  @IsArray()
  @IsEnum(MenuStatus, { each: true })
  status_in?: MenuStatus[];

  @IsOptional()
  @IsArray()
  @IsDate({ each: true })
  @Type(() => Date)
  createdAt_range?: Date[];
}

export class MenuListQueryDto extends factorySpectificationQueryDto<MenuFilterDto>({
  filterCls: MenuFilterDto,
  searchFields: ['name', 'note'],
  sortFields: ['createdAt'],
}) {}

export class UserCreateMenuDto extends Menu {}

export class UserUpdateMenuDto extends PartialType(UserCreateMenuDto) {}
