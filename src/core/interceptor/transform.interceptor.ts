import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface MetaInterface {
    headers: any;
    params: any;
    status: boolean;
    errorCode?: string;
    timestamp: Date;
    requestId: string;
}

export interface Response<T> {
    meta: MetaInterface;
    result: T;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<any>> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, headers, params, status } = request;
        //TODO create request id from crypto service
        request.id = (Math.random() + 1).toString(36).substring(2);
        return next.handle().pipe(
            map((data) => {
                const res = {
                    meta: {
                        headers: headers,
                        params: params,
                        status: status,
                        timestamp: new Date(),
                        requestId: request.id
                    },
                    result: data
                };
                return res;
            })
        );
    }
}
