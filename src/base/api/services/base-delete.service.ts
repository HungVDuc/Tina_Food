import { Document, FilterQuery } from 'mongoose';
import { BaseCreateOrUpdateService } from './base-create-or-update.service';
import { IExtraOptions } from './base.interface';

export class BaseDeleteService<TDoc extends Document> extends BaseCreateOrUpdateService<TDoc> {
  /* Delete Soft One */
  protected async preDeleteSoftOne(filter: FilterQuery<TDoc>, extraOptions?: IExtraOptions) {}

  protected async postDeleteSoftOne(
    data: TDoc,
    filter: FilterQuery<TDoc>,
    extraOptions?: IExtraOptions,
  ) {
    return data;
  }

  async deleteSoftOneBy(filter: FilterQuery<TDoc>, extraOptions?: IExtraOptions) {
    await this.preDeleteSoftOne(filter, extraOptions);
    const deleted = await this.model.findOneAndUpdate(
      filter,
      {
        $set: {
          deleteAt: new Date(),
        },
      },
      { new: true },
    );

    return this.postDeleteSoftOne(deleted, filter, extraOptions);
  }
}
