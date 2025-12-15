import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsNotEmpty } from 'class-validator';

export class MongoIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class CreatedAtDto {
  @Optional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;
}
