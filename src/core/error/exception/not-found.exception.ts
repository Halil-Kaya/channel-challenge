import { CustomException } from './custom.exception';
import { ErrorCode } from '../error-code';

export class NotFoundException extends CustomException {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.NOT_FOUND, errorMessage = 'Not Found') {
        super(message, 404, errorCode, errorMessage);
    }
}
