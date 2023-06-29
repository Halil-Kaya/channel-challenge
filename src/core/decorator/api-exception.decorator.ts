import { CustomException } from '../error/exception/custom.exception';
import { ApiResponseOptions } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

export function ApiException(...Exceptions: (new () => CustomException)[]): MethodDecorator {
    const apiExceptions = Exceptions.map((Exception): [number, ApiResponseOptions] => {
        const exception = new Exception() as CustomException;

        return [
            exception.httpStatusCode,
            {
                schema: {
                    title: exception.constructor.name,
                    properties: {
                        meta: {
                            type: 'object',
                            properties: {
                                requestId: {
                                    type: 'string',
                                    default: 'req-1'
                                },
                                httpStatusCode: {
                                    type: 'number',
                                    default: exception.httpStatusCode
                                },
                                errorCode: {
                                    type: 'string',
                                    default: exception.errorCode
                                },
                                errorMessage: {
                                    type: 'string',
                                    default: exception.errorMessage
                                },
                                message: {
                                    type: 'string',
                                    default: exception.message
                                },
                                isCustomError: {
                                    type: 'string',
                                    default: exception.isCustomError
                                }
                            }
                        }
                    }
                }
            }
        ];
    });
    const groupedMetadata = {};
    apiExceptions.forEach(([statusCode, value]) => {
        groupedMetadata[statusCode] = groupedMetadata[statusCode] ?? { schema: { oneOf: [] } };
        groupedMetadata[statusCode].schema.oneOf.push(value['schema']);
    });

    return (target: object, key?: string | symbol, descriptor?: PropertyDescriptor) => {
        const responses = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value) || {};
        Reflect.defineMetadata(DECORATORS.API_RESPONSE, { ...responses, ...groupedMetadata }, descriptor.value);
        return descriptor;
    };
}
