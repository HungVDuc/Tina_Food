import { BaseService } from 'src/base/api/services/base-service';
import { User, UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IExtraOptions } from 'src/base/api/services/base.interface';
import * as bcrypt from 'bcrypt';
import { QuerySpecificationDto } from 'src/base/api/dtos';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(@InjectModel(User.name) protected readonly model: Model<UserDocument>) {
    super(model);
  }

  protected override async preCreateOrUpdate(
    dto: Partial<UserDocument>,
    oldRecord: UserDocument,
    extraOptions?: IExtraOptions,
  ) {
    if (dto.password) {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      dto.password = hashedPassword;
    }

    return super.preCreateOrUpdate(dto, oldRecord, extraOptions);
  }

  protected override getProjection(
    query?: QuerySpecificationDto,
    extraOptions?: IExtraOptions,
  ): ProjectionType<UserDocument> {
    return {
      password: 0,
    };
  }
}
