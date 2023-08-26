import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInspector<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(map((data) => this.transformResponse(data)));
  }
  private transformResponse(data: T): any {
    return {
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
