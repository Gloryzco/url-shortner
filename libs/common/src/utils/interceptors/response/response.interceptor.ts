import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { responseHandler } from '../../handlers/response.handler';
import { errorHandler } from '../../handlers/error.handler';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: Record<string, unknown>) => responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => errorHandler(err, context)),
      ),
    );
  }
}
