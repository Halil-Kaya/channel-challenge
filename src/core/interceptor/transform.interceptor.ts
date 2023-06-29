import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { maskHelper } from '../helper';
import { logger } from '../logger/logger';
import { CryptoService } from '../service';
import { UnauthorizedException } from '../error';

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
    constructor(private readonly cryptoService: CryptoService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<string> {
        try {
            const request = context.switchToHttp().getRequest();
            const { body, headers, params, status } = request;
            request.body = this.cryptoService.decrypt(body.data);
            request.reqId = this.cryptoService.generateReqId();
            logger.info({
                type: 'REQ',
                req: request,
                body: maskHelper(request.body, ['password', 'accessToken']),
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
                        body: maskHelper(res, ['password', 'accessToken']),
                        respTime: Date.now() - request.reqStartTime,
                        user: request.user
                    });
                    return this.cryptoService.encrypt(res);
                })
            );
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}
