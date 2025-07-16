import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((response) => {
        const { data, pagination, message, ...rest } = response || {};

        return {
          data: data ?? response ?? null,
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: message ?? 'success',
          ...(pagination ? { pagination } : {}),
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      })
    );
  }
}
