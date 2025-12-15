import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { factorySpectificationQueryDto } from 'src/base/api/dtos';
import { HideCreatedByDto } from 'src/base/api/dtos/common-hide-property';

class MenuOrder extends HideCreatedByDto {
  @ApiProperty({
    example: '693a70a15009c56bbc58a99e',
    description: 'Mã định danh Menu',
  })
  @IsString()
  menuId: string;

  @ApiProperty({
    example: '693a70a15009c56bbc58a99e',
    description: 'Mã định danh món',
  })
  @IsString()
  dishId: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Số lượng muốn đặt',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  priceAtOrder?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @ApiPropertyOptional({
    example: 1000,
    description: 'Số tiền muốn tip',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  tipAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}

class MenuOrderFilter extends PartialType(PickType(MenuOrder, ['dishId'])) {}

export class MenuOrderListQueryDto extends factorySpectificationQueryDto<MenuOrderFilter>({
  filterCls: MenuOrderFilter,
  sortFields: ['createdAt', 'quantity'],
}) {}

export class UserCreateMenuOrderDto extends MenuOrder {}

export class UserUpdateMenuOrderDto extends PartialType(
  OmitType(UserCreateMenuOrderDto, ['menuId', 'dishId']),
) {}
