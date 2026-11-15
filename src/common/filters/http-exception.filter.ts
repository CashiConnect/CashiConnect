import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';




@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();


    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';


    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body: any = exception.getResponse();
      message = body.message ?? exception.message;
    } 
    else if (exception instanceof QueryFailedError) {
      const dbError: any = exception.driverError;

      if (dbError.code === '23505') {
        statusCode = HttpStatus.CONFLICT;
        message = 'This value already exists';
      } 
      else if (dbError.code === '23503') {
        statusCode = HttpStatus.CONFLICT;
        message = 'Related records exist or a referenced record is missing';
      } 
      else {
        this.logger.error(exception.message, exception.stack);
      }
    } 
    else {
      this.logger.error(String(exception), (exception as Error)?.stack);
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}