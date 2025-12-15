import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Type as NestType } from '@nestjs/common';

import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TransformSort } from 'src/base/validators/validator.transformer';

// PAGINATION
class PaginationSpecificationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;
}

export class PaginationDto extends PaginationSpecificationDto {
  static readonly getSkip = (query?: Partial<PaginationSpecificationDto>) => {
    return ((query?.page || 1) - 1) * (query?.limit || 50);
  };
}

// Sort
class SortSpecificationDto {
  @IsOptional()
  @IsObject()
  sort?: Record<string, any>;
}

// Search
class SearchSpecificationDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchFields?: string[];

  @IsOptional()
  @IsBoolean()
  isSearchText?: boolean;
}

class SearchDto extends SearchSpecificationDto {}

// Query
export class QuerySpecificationDto<TFilter = Record<string, any>> extends IntersectionType(
  PaginationDto,
  SortSpecificationDto,
  SearchDto,
) {
  filter?: TFilter;
}

export type FactoryType<TFilter> = NestType<
  Pick<QuerySpecificationDto<TFilter>, keyof QuerySpecificationDto<TFilter>>
>;

export interface IFactoryOption {
  sortFields?: string[];
  searchFields?: string[];
  isSearchText?: boolean;
  filterCls: NestType;
}

export const factoryQueryDto = <TFilter>(options: IFactoryOption): FactoryType<TFilter> => {
  class Factory {
    @IsNotEmpty()
    @TransformSort(options.sortFields)
    @IsObject()
    sort?: Record<string, any>;

    @IsNotEmpty()
    @IsIn(options.searchFields, { each: true })
    @IsString({ each: true })
    @IsArray()
    @Transform(({ value }) =>
      Array.isArray(value) ? value.filter((val) => options.searchFields?.includes(val)) : value,
    )
    searchFields?: string[] = options.searchFields;

    @IsOptional()
    @IsBoolean()
    isSearchText?: boolean = options.isSearchText;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => options.filterCls)
    filter?: TFilter;
  }

  class FactoryOptional extends PartialType(Factory) {}

  const pickOptionKeys: any[] = ['isSearchText'];
  options.sortFields && pickOptionKeys.push('sort');
  options.searchFields && pickOptionKeys.push('searchFields');
  options.filterCls && pickOptionKeys.push('filter');

  return PickType(FactoryOptional, pickOptionKeys);
};

export const factorySpectificationQueryDto = <TFilter>(
  options: IFactoryOption,
): FactoryType<TFilter> => {
  class SpecificationDto extends factoryQueryDto<TFilter>(options) {}
  return SpecificationDto;
};
