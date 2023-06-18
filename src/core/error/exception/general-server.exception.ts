import { ErrorCode } from '../error-code';
import { CustomException } from './custom.exception';

export class GeneralServerException extends CustomException {
    constructor() {
        super('General Server Exception', 500, ErrorCode.GENERAL_SERVER_ERROR);
    }
}
