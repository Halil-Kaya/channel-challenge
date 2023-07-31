import { ErrorCode } from '../error-code';
import { ForbiddenException } from './forbidden.exception';

export class UserNotInChannelException extends ForbiddenException {
    constructor() {
        super('User not in channel', ErrorCode.CHANNEL_NOT_FOUND);
    }
}
