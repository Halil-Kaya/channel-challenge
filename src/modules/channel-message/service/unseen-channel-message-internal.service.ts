import { Injectable } from '@nestjs/common';
import { UnseenChannelMessageRepository } from '../repository';
import { UnseenChannelMessage } from '../../../core/interface';
import { ClientSession } from 'mongoose';

@Injectable()
export class UnseenChannelMessageInternalService {
    constructor(private readonly unseenChannelMessageRepository: UnseenChannelMessageRepository) {}

    bulkWrite(unseenChannelMessages: Omit<UnseenChannelMessage, '_id' | 'createdAt'>[], session?: ClientSession) {
        return this.unseenChannelMessageRepository.bulkWrite(unseenChannelMessages, session);
    }

    getUnseenMessagesByUserId(userId: string, session?: ClientSession): Promise<UnseenChannelMessage[]> {
        return this.unseenChannelMessageRepository.getUnseenMessagesByUserId(userId, session);
    }
}
