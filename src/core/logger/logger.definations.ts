import { CustomException } from '../error/exception/custom.exception';

export type Logger = {
    info: (params: LogParameters) => void;
    warn: (params: LogParameters) => void;
    error: (params: LogParameters) => void;
};

export type LogLevel = 'info' | 'error' | 'warn';

export interface LogParameters {
    reqId?: string;
    respTime?: number;
    body?: any;
    req?: {
        url?: string;
        reqId: string;
        ip?: string;
        method?: string;
        event?: string;
    };
    user?: {
        _id?: string;
        nickname?: string;
    };
    event?: string;
    method?: 'POST' | 'GET' | 'PATCH' | 'SOCKET' | 'RABBITMQ';
    content?: string;
    meta?: Record<string, any>;
    err?: CustomException & {
        errorCode: number;
        message: string;
        stack: string;
    };
    type?: 'REQ' | 'RES' | 'EMIT' | 'ACK';
}
