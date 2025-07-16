import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Logger as CustomLogger } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: CustomLogger,
    private readonly reflector: Reflector // Reflector for metadata retrieval
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const methodName = handler.name;

    // Retrieve metadata for logging
    const hasLog = this.reflector.get<boolean>('log', handler);

    if (!hasLog) {
      return next.handle();
    }

    const args = context.getArgs();
    const className = context.getClass().name;

    // Log method call with parameters
    this.logger.log(`Entering ${className} - ${methodName} with args: ${JSON.stringify(args)}`);

    const now = Date.now();
    return next.handle().pipe(
      tap((response) => {
        // Log method exit with response and execution time
        const executionTime = Date.now() - now;
        this.logger.log(
          `Exiting ${className} - ${methodName} with result: ${JSON.stringify(response)} (Execution Time: ${executionTime}ms)`
        );
      })
    );
  }
}
