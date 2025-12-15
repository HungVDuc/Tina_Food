import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { HideCreatedByDto } from 'src/base/api/dtos/common-hide-property';
import { MenuSize } from '../enums/menu.enum';
import { ApiHideProperty, ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { factorySpectificationQueryDto } from 'src/base/api/dtos';

class Dish extends HideCreatedByDto {
  @ApiProperty({
    example: '693a70a15009c56bbc58a99e',
    description: 'Mã định danh Menu',
  })
  @IsString()
  menuId: string;

  @ApiProperty({
    example: 'Ăn trưa',
    description: 'Tên món',
  })
  @IsString()
  name: string;

  @ApiProperty({
    enum: MenuSize,
    example: MenuSize.ONE_SIZE,
  })
  @IsEnum(MenuSize)
  size: MenuSize;

  @ApiProperty({
    example: 10000,
    description: 'Giá bán',
  })
  @IsNumber()
  originalPrice: number;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  orderedQuantity?: number;
}

export class DistFilterDto extends PartialType(PickType(Dish, ['menuId', 'size'])) {}

export class DistListQueryDto extends factorySpectificationQueryDto({
  filterCls: DistFilterDto,
  sortFields: ['createdAt'],
}) {}

export class UserCreateDishDto extends Dish {}

export class UserUpdateDishDto extends PartialType(OmitType(UserCreateDishDto, ['menuId'])) {}
