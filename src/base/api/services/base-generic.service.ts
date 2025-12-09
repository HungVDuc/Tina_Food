import { NotFoundException } from '@nestjs/common';
import { Document, FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

export class BaseGenericService<TDoc extends Document> {
  constructor(protected readonly model: Model<TDoc>) {}

  recordNotFound<TData>(record: TData): TData {
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  private async findOne(
    filter: FilterQuery<TDoc>,
    projection?: ProjectionType<TDoc>,
    options?: QueryOptions<TDoc>,
  ): Promise<TDoc | null> {
    if (filter.id) {
      filter._id = filter.id;
      delete filter.id;
    }

    return this.model.findOne(filter, projection, options);
  }

  async findOneBy(filter: FilterQuery<TDoc>, projection?: ProjectionType<TDoc>) {
    return this.findOne(filter, projection);
  }

  async getOneBy(filter: FilterQuery<TDoc>): Promise<TDoc> {
    const record = await this.findOne(filter);
    return this.recordNotFound(record);
  }

  async getOne(
    filter: FilterQuery<TDoc>,
    projection?: ProjectionType<TDoc>,
    options?: QueryOptions<TDoc>,
  ): Promise<TDoc | null> {
    const record = await this.findOne(filter, projection, options);
    return this.recordNotFound(record);
  }

  async getById(_id: string) {
    return this.getOne({ _id });
  }
}
