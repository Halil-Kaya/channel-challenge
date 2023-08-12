import { ErrorCode } from '../error-code';
import { ForbiddenException } from './forbidden.exception';

export class UserNotInChannelException extends ForbiddenException {
    constructor() {
        super('User not in channel', ErrorCode.USER_NOT_IN_CHANNEL);
    }
}
