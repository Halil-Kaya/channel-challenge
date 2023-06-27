import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { maskHelper } from '../helper';
import { logger } from '../logger/logger';

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
        const { body, headers, params, status } = request;
        request.reqId = (Math.random() + 1).toString(36).substring(2);
        logger.info({
            type: 'REQ',
            req: request,
            body: maskHelper(body, ['password']),
            user: request.user
        });
        request.reqStartTime = Date.now();
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
                logger.info({
                    type: 'RES',
                    req: request,
                    body: maskHelper(res, ['password']),
                    respTime: Date.now() - request.reqStartTime,
                    user: request.user
                });
                return res;
            })
        );
    }
}
