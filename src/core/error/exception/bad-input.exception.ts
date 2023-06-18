import { CustomException } from './custom.exception';
import { ErrorCode } from '../error-code';

export class BadInputException extends CustomException {
    constructor(message: string = 'Bad Input', errorCode: ErrorCode = ErrorCode.INVALID_CREDENTIALS) {
        super(message, 400, errorCode);
    }
}
