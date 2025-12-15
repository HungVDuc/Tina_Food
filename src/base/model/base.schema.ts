import { Prop, Schema as NSchema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Schema } from 'mongoose';

@NSchema({ _id: false, timestamps: false })
export class Author {
  @IsString()
  @Prop({ required: true, type: Schema.Types.ObjectId, ref: 'User' })
  id: string;

  @IsString()
  @Prop({ required: true, type: String })
  userName: string;

  @IsOptional()
  @IsString()
  @Prop({ required: false, type: String })
  nameDisplay?: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

export class BaseSchema {
  id: string;

  @Prop({ required: false, type: Author })
  createdBy?: Author;

  @Prop({ required: false, type: Author })
  updatedBy?: Author;

  @Prop({ required: false, type: Date })
  deletedAt?: Date;
}
