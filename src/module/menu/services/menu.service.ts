import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/api/services/base-service';
import { Menu, MenuDocument } from '../schemas/menu.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOption } from 'mongoose';
import { QuerySpecificationDto } from 'src/base/api/dtos';
import { IExtraOptions } from 'src/base/api/services/base.interface';

@Injectable()
export class MenuService extends BaseService<MenuDocument> {
  constructor(@InjectModel(Menu.name) protected readonly model: Model<MenuDocument>) {
    super(model);
  }

  // protected override getPopulate(
  //   query?: QuerySpecificationDto,
  //   extraOptions?: IExtraOptions,
  // ): PopulateOption {
  //   return {
  //     populate: [
  //       {
  //         path: 'createdBy',
  //         populate: 'id',
  //       },
  //       {
  //         path: 'updatedBy',
  //         populate: 'id',
  //       },
  //     ],
  //   };
  // }
}
