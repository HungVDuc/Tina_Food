import { Document, FilterQuery, PopulateOption, ProjectionType, QueryOptions } from 'mongoose';
import { BaseGenericService } from './base-generic.service';
import { PaginationDto, QuerySpecificationDto } from '../dtos';
import { IExtraOptions } from './base.interface';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { plainText, safeRegex } from 'src/base/util/string.convert';
import _ from 'lodash';
import { PaginatedResult } from '../api.schema';

export class BaseListSerive<TDoc extends Document> extends BaseGenericService<TDoc> {
  /* List */
  async list(query?: QuerySpecificationDto, extraOptions?: IExtraOptions) {
    const { filter, projection, options } = await this.preFindAll(query, extraOptions);
    delete options.limit;
    delete options.skip;
    const data: TDoc[] = await this.model.find(filter, projection, options);
    return this.postFindAll(data, query, extraOptions);
  }

  async listPaginate(
    query?: QuerySpecificationDto,
    extraOptions?: IExtraOptions,
  ): Promise<PaginatedResult<TDoc>> {
    const { filter, projection, options } = await this.preFindAll(query, extraOptions);
    const total = await this.model.countDocuments(filter);
    let data: TDoc[] = await this.model.find(filter, projection, options);
    data = await this.postFindAll(data, query, extraOptions);
    return new PaginatedResult(data, query, { total });
  }
  /* Helper */
  protected async preFindAll(query?: QuerySpecificationDto, extraOptions?: IExtraOptions) {
    return {
      filter: this.getFilter(query, extraOptions),
      projection: this.getProjection(query, extraOptions),
      options: this.getOptions(query, extraOptions),
    };
  }

  protected async postFindAll(
    data: TDoc[],
    query?: QuerySpecificationDto,
    extraOptions?: IExtraOptions,
  ) {
    return data;
  }

  /* Filter */
  protected getFilter(
    query?: QuerySpecificationDto,
    extraOptions?: IExtraOptions,
  ): FilterQuery<TDoc> {
    const { filter = {}, q, searchFields, isSearchText } = query;
    filter &&
      Object.entries(filter).map(([filterKey, filterValue]) => {
        if (isUndefined(filterValue)) return delete filter[filterKey];

        if (filterKey === 'id') {
          filter._id = filterValue;
          delete filter.id;
        }

        if (filterKey === 'ids') {
          filter._id = filterValue;
          delete filter.ids;
        }

        if (filterKey.endsWith('Ids')) {
          filter[filterKey.substring(0, filterKey.length - 1)] = filterValue;
          delete filter[filterKey];
        }

        if (filterKey.includes('_')) {
          this.processFilter(filter, [filterKey, filterValue]);
        }
      });

    if (q) {
      if (searchFields?.length)
        _.set(
          filter,
          '$or',
          searchFields.map((field) => ({ [field]: new RegExp(safeRegex(q), 'ui') })),
        );
      else if (isSearchText) Object.assign(filter, { $text: { $search: plainText(q) } });
    }
    return filter;
  }

  /* Projection */
  protected getProjection(
    query?: QuerySpecificationDto,
    extraOptions?: IExtraOptions,
  ): ProjectionType<TDoc> {
    return {};
  }

  /* Option */
  protected getSort(query?: QuerySpecificationDto, extraOptions?: IExtraOptions) {
    return {
      sort: query?.sort,
    };
  }

  protected getPaginate(query?: QuerySpecificationDto, extraOptions?: IExtraOptions) {
    return {
      limit: query?.limit,
      skip: PaginationDto.getSkip(query),
    };
  }

  protected getPopulate(
    query?: QuerySpecificationDto,
    extraOptions?: IExtraOptions,
  ): PopulateOption {
    return {
      populate: undefined,
    };
  }

  protected getOptions(
    query?: QuerySpecificationDto,
    extraOptions?: IExtraOptions,
  ): QueryOptions<TDoc> {
    return Object.assign({}, this.getSort(query), this.getPaginate(query), this.getPopulate(query));
  }

  private processFilter(
    filter: Record<string, any>,
    [filterKey, filterValue]: [string, any],
  ): FilterQuery<TDoc> {
    delete filter[filterKey];
    const keys = filterKey.split('_');
    const suffix = keys.pop().toUpperCase();
    let key = keys.join('_');
    key = key === 'id' ? '_id' : key;

    switch (suffix) {
      // ARRAY
      case 'IN':
        return (filter[key] = { $in: filterValue });
      case 'NIN':
        return (filter[key] = { $nin: filterValue });
      case 'INCLUDE':
        return (filter[key] = filterValue);
      case 'EXCLUDE':
        return (filter[key] = { $ne: filterValue });
      case 'CONTAINALL':
        return (filter[key] = { $all: filterValue });
      case 'CONTAINANY':
        return (filter[key] = { $in: filterValue });

      // STRING
      case 'STARTWITH':
        return (filter[key] = { $regex: new RegExp('^' + safeRegex(filterValue), 'ui') });
      case 'ENDWITH':
        return (filter[key] = { $regex: new RegExp(safeRegex(filterValue) + '$', 'ui') });
      case 'HAVE':
        return (filter[key] = { $regex: new RegExp(safeRegex(filterValue), 'ui') });
      case 'HAVENOT':
        return (filter[key] = { $not: { $regex: new RegExp(safeRegex(filterValue), 'ui') } });

      // NUMBER, DATE
      case 'GTE':
        return (filter[key] = { $gte: filterValue });
      case 'GT':
        return (filter[key] = { $gt: filterValue });
      case 'LTE':
        return (filter[key] = { $lte: filterValue });
      case 'LT':
        return (filter[key] = { $lt: filterValue });
      case 'RANGE':
        return (filter[key] = { $gte: filterValue.shift(), $lte: filterValue.pop() });
      case 'BOUND':
        return (filter[key] = { $gt: filterValue.shift(), $lt: filterValue.pop() });

      // COMMON
      case 'EQ':
        return (filter[key] = filterValue);
      case 'NE':
        return (filter[key] = { $ne: filterValue });
      case 'ISNULL':
        return (filter[key] = { $exists: false });
      case 'EXIST':
        return (filter[key] = { $exists: true });

      default:
        return (filter[key] = filterValue);
    }
  }
}
