import { ErrorCode } from '../error-code';
import { CustomException } from './custom.exception';

export class TooManyRequestException extends CustomException {
    constructor(message: string, errorCode: ErrorCode, errorMessage = 'Too Many Request') {
        super(message, 429, errorCode, errorMessage);
    }
}
