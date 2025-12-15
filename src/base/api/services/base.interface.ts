import { User } from 'src/module/user/schemas/user.schema';

export interface IExtraOptions {
  extraData?: Record<string, any>;
  updateOne?: {
    includeOldRecord: boolean;
  };
  user?: User;
}
