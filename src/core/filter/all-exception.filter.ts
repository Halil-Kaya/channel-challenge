import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { GeneralServerException } from '../error';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private logger = new Logger(AllExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (!exception.isCustomError) {
            this.logger.error(
                `RES:[${request.reqId}]:[${request.user?._id}]:[UNHANDLED ERROR]: [${exception?.message}] :-> `,
                JSON.stringify(exception)
            );
            exception = new GeneralServerException();
        } else {
            this.logger.error(
                `RES:[${request.reqId}]:[${request.user?._id}]:[ERROR:${
                    exception.errorCode
                }] ${exception.message.toUpperCase()}`
            );
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
