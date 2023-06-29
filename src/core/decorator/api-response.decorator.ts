import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

export const ApiResponseSchema = (): MethodDecorator => {
    return (target: object, key?: string | symbol, descriptor?: PropertyDescriptor) => {
        const responses = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value) || {};
        const status = Object.keys(responses)[0];
        const response = responses[status] || {};
        ApiResponse({
            schema: {
                properties: {
                    meta: {
                        type: 'object',
                        properties: {
                            requestId: {
                                type: 'string'
                            },
                            headers: {
                                type: 'object'
                            },
                            params: {
                                type: 'object'
                            },
                            status: {
                                type: 'number',
                                default: status
                            },
                            timestamp: {
                                type: 'number',
                                default: 1688043349948
                            }
                        }
                    },
                    result: { $ref: getSchemaPath(response.type), type: 'object' }
                }
            }
        })(target, key, descriptor);
        const newResponses = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value) || {};
        let tmp = newResponses[status];
        newResponses[status] = newResponses['default'];
        newResponses['default'] = tmp;
        return descriptor;
    };
};
