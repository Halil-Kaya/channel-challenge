import { BadInputException } from './bad-input.exception';
import { ErrorCode } from '../error-code';

export class NicknameAlreadyTakenException extends BadInputException {
    constructor() {
        super('Nickname is already taken', ErrorCode.NICKNAME_ALREADY_TAKEN);
    }
}
