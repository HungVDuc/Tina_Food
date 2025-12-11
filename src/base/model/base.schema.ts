import { Prop, Schema as NSchema, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

@NSchema({ _id: false, timestamps: false })
export class Author {
  @Prop({ required: true, type: Schema.Types.ObjectId, ref: 'User' })
  id: string;

  @Prop({ required: true, type: String })
  userName: string;

  @Prop({ required: false, type: String })
  nameDisplay?: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

export class BaseSchema {
  @Prop({ required: false, type: Author })
  createdBy?: Author;

  @Prop({ required: false, type: Author })
  updatedBy?: Author;

  @Prop({ required: false, type: Date })
  deletedAt?: Date;
}
