import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { defaultPayload } from '../api/api.schema';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) =>
          data?.meta
            ? { ...defaultPayload, data: data.data, meta: data.meta, message: data.message }
            : { ...defaultPayload, data: data ?? null },
        ),
      );
  }
}
