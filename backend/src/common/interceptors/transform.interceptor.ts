import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  data: T;
  pagination?: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((res) => {
        // If response is already custom structured with pagination or csv stream
        if (res && res._isRaw) {
          return res.data;
        }

        if (res && typeof res === 'object' && 'pagination' in res && 'data' in res) {
          return {
            success: true,
            statusCode,
            data: res.data,
            pagination: res.pagination,
          };
        }

        if (res && typeof res === 'object' && 'products' in res && 'pagination' in res) {
          return {
            success: true,
            statusCode,
            data: res.products,
            pagination: res.pagination,
          };
        }

        if (res && typeof res === 'object' && 'inquiries' in res && 'pagination' in res) {
          return {
            success: true,
            statusCode,
            data: res.inquiries,
            pagination: res.pagination,
          };
        }

        return {
          success: true,
          statusCode,
          data: res,
        };
      }),
    );
  }
}
