export interface IExtraOptions {
  extraData?: Record<string, any>;
  updateOne?: {
    includeOldRecord: boolean;
  };
}
