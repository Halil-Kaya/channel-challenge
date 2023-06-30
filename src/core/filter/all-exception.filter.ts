import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GeneralServerException } from '../error';
import { logger } from '../logger/logger';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (!exception.isCustomError) {
            logger.error({
                type: 'RES',
                req: request,
                respTime: Date.now() - request.reqStartTime,
                user: request.user,
                err: exception
            });
            exception = new GeneralServerException();
        } else {
            logger.warn({
                type: 'RES',
                req: request,
                respTime: Date.now() - request.reqStartTime,
                user: request.user,
                err: exception
            });
        }
        response.status(500).json({
            meta: {
                headers: request.headers,
                params: request.params,
                status: request.status,
                errorCode: exception.errorCode,
                errorMessage: exception.message,
                timestamp: new Date(),
                requestId: request.reqId
            },
            result: exception
        });
    }
}
