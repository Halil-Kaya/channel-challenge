import { CustomException } from './custom.exception';
import { ErrorCode } from '../error-code';

export class BadInputException extends CustomException {
    constructor(
        message: string,
        errorCode: ErrorCode = ErrorCode.INVALID_CREDENTIALS,
        errorMessage: string = 'Bad Input'
    ) {
        super(message, 400, errorCode, errorMessage);
    }
}
