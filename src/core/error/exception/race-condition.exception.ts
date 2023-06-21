import { TooManyRequestException } from './too-many-request.exception';
import { ErrorCode } from '../error-code';

export class RaceConditionException extends TooManyRequestException {
    constructor(message) {
        super(message, ErrorCode.RACE_CONDITION);
    }
}
