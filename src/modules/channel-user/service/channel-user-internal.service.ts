import { Injectable } from '@nestjs/common';
import { ChannelUserRepository } from '../repository/channel-user.repository';
import { ChannelUser, ChannelUserStatus } from '../../../core/interface';
import { ClientSession } from 'mongoose';

@Injectable()
export class ChannelUserInternalService {
    constructor(private readonly channelUserRepository: ChannelUserRepository) {}

    findOneAndUpdate(
        filter: Partial<ChannelUser>,
        payload: Partial<Omit<ChannelUser, '_id' | 'createdAt'>>,
        session?: ClientSession
    ): Promise<ChannelUser> {
        return this.channelUserRepository.findOneAndUpdate(filter, payload, session);
    }

    async isInChannel(userId: string, channelId: string): Promise<boolean> {
        const result = await this.channelUserRepository.isExist({
            channelId,
            userId,
            status: ChannelUserStatus.ACTIVE
        });
        return !!result;
    }

    async getUsersOfChannel(channelId: string, excludedIds: string[] = []): Promise<ChannelUser[]> {
        return this.channelUserRepository.getUsersOfChannel(channelId, excludedIds);
    }

    async getChannelUserById(userId: string): Promise<ChannelUser[]> {
        return this.channelUserRepository.getChannelUserById(userId);
    }
}
