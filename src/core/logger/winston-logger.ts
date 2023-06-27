import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
const chalk = require('chalk');

const consoleLogFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf(({ timestamp, level, message }) => {
        const logMessage: WintstonLogParameter = message;

        if (level == 'info') {
            return `[${timestamp}] ${chalk.green(level.toUpperCase())}: ${chalk.cyan(
                `[${logMessage.type}] [${logMessage.reqId}] [${logMessage.userId + '|' + logMessage.userNickname}] [${
                    logMessage.event
                }]: `
            )} ${chalk.gray(JSON.stringify(logMessage.body))}`;
        }
        if (level == 'error') {
            return `[${timestamp}] ${chalk.red(level.toUpperCase())}: ${chalk.red(
                `[${logMessage.type}] [${logMessage.reqId}] [${logMessage.userId + '|' + logMessage.userNickname}] [${
                    logMessage.event
                }] [ERROR:${logMessage.err?.errorCode || ''}] ${logMessage.err?.message?.toUpperCase()}: `
            )} ${chalk.gray(JSON.stringify(logMessage.err || logMessage.body))} ${logMessage.err?.stack}`;
        }
        if (level == 'warn') {
            return `[${timestamp}] ${chalk.yellow(level.toUpperCase())}: ${chalk.cyan(
                `[${logMessage.type}] [${logMessage.reqId}] [${logMessage.userId + '|' + logMessage.userNickname}] [${
                    logMessage.event
                }]: `
            )} ${chalk.gray(JSON.stringify(logMessage.body))}`;
        }
        return `[${timestamp}] ${chalk.green(level.toUpperCase())}: ${chalk.cyan(
            `[${logMessage.type}] [${logMessage.reqId}] [${logMessage.userId + '|' + logMessage.userNickname}] [${
                logMessage.event
            }]: `
        )} ${chalk.gray(JSON.stringify(logMessage.body))}`;
    })
);

const fileLogFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf(({ timestamp, level, message, meta }) => {
        return JSON.stringify({
            time: timestamp,
            level,
            ...message,
            ...meta
        });
    })
);

export const winstonLogger = winston.createLogger({
    format: fileLogFormat,
    transports: [
        new winston.transports.Console({
            format: consoleLogFormat
        }),
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ],
    exitOnError: false
});

export type WintstonLogParameter = {
    reqId?: string;
    respTime?: number;
    body?: any;
    req?: {
        url?: string;
        reqId: string;
        clientIp: string;
        method?: string;
        event?: string;
    };
    userId?: string;
    userNickname?: string;
    event?: string;
    method?: 'POST' | 'GET' | 'PATCH' | 'SOCKET';
    message?: string;
    meta?: Record<string, any>;
    err?: {
        errorCode: number;
        message: string;
        stack: string;
    };
    type?: 'REQ' | 'RES' | 'EMIT' | 'ACK';
};
