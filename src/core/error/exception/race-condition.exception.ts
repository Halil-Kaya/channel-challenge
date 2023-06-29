import { TooManyRequestException } from './too-many-request.exception';
import { ErrorCode } from '../error-code';

export class RaceConditionException extends TooManyRequestException {
    constructor(message = 'RACE_CONDITION:') {
        super(message, ErrorCode.RACE_CONDITION);
    }
}
