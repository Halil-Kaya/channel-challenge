import { winstonLogger, WintstonLogParameter } from './winston-logger';
import { Logger, LogLevel, LogParameters } from './logger.definations';

export const logger: Logger = createLogger();

function createLogger() {
    return {
        info: (params) => logWithLevel('info', params),
        warn: (params) => logWithLevel('warn', params),
        error: (params) => logWithLevel('error', params)
    };
}

function logWithLevel(level: LogLevel, params: LogParameters): void {
    let { req, user, method, type, respTime, reqId, meta, err, event, body, message } = params;
    let errStack;
    let customError;
    if (err) {
        errStack = err?.stack.toString();
    }
    winstonLogger[level](<WintstonLogParameter>{
        ip: req?.ip || '#no-ip',
        reqId: reqId || req?.reqId || '#no-req-id',
        userId: user?._id || '#no-user',
        userNickname: user?.nickname || '#no-user',
        method: method || req?.method || '#no-method',
        event: event || req?.url || '#no-event',
        type,
        respTime,
        err: err || customError,
        errStack,
        body,
        meta,
        message
    });
}
