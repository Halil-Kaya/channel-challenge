import { CustomException } from './custom.exception';
import { ErrorCode } from '../error-code';

export class ForbiddenException extends CustomException {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.FORBIDDEN, errorMessage = 'Forbidden') {
        super(message, 403, errorCode, errorMessage);
    }
}
