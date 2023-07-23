import { ErrorCode } from '../error-code';
import { NotFoundException } from './not-found.exception';

export class ChannelNotFoundException extends NotFoundException {
    constructor() {
        super('Channel not found', ErrorCode.NOT_FOUND);
    }
}
