import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { Author } from 'src/base/model/base.schema';

export class HideCreatedByDto {
  @ApiHideProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => Author)
  createdBy?: Author;

  @ApiHideProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => Author)
  updatedBy?: Author;
}
