import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class RestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RestExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Podrazumevane vrednosti za nepoznate greške
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | object = 'Internal server error';

    // Ako je greška HttpException (ugrađena Nest greška)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      // Ekstrahujemo poruku i opis greške iz HttpException odgovora
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || exception.message;
        error = responseObj.error || exception.name;
      }
      // U slučaju da je poruka niz (npr. greške validacije), zadržavamo ceo niz
    }

    // Logovanje greške (metod, URL, status i stack trace)
    this.logger.error(
      `HTTP ${request.method} ${request.url} -> ${status} ${error}: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : ''
    );

    // Formiranje standardizovanog JSON odgovora za grešku
    const errorResponse = {
      data: null,
      statusCode: status,
      error: error,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
