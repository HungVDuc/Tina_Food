export const defaultPayload = {
  success: true,
  status: 200,
  statusText: 'SUCCESS',
  errorCode: '000000',
  message: '',
  data: null,
  meta: null,
};

export class PaginatedMeta {
  totalItem?: number;

  totalPages?: number;

  currentPage?: number;

  [s: string]: any;

  constructor(query: Record<string, any>, partial: PaginatedMeta) {
    Object.assign(this, {
      ...partial,
      pageSize: query.limit,
      currentPage: query.page,
      totalPages: Math.ceil(Number(partial.total) / Number(query.limit)),
    });
  }
}

export class PaginatedResult<TData> {
  meta: PaginatedMeta;

  data: TData[];

  constructor(data: TData[], query: Record<string, any>, partial: PaginatedMeta) {
    this.data = data;
    this.meta = new PaginatedMeta(query, partial);
  }
}
