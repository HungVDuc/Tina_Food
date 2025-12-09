import { Document } from 'mongoose';
import { BaseDeleteService } from './base-delete.service';

export class BaseService<TDoc extends Document> extends BaseDeleteService<TDoc> {}
