import { ErrorCode } from '../error-code';
import { CustomException } from './custom.exception';

export class UnauthorizedException extends CustomException {
    constructor() {
        super('Unauthorized exception', 401, ErrorCode.UNAUTHORIZED);
    }
}
