export const cacheKeys = {
    //userId -> User, Expires
    user: (userId: string) => `ex:user:${userId}`,

    //channelId -> Channel, Expires
    channel: (channelId: string) => `ex:channel:${channelId}`,

    //userId -> UserSession
    session_user: (userId: string) => `user_sessions:${userId}`,

    //Hash nickname -> userId
    nickname_map: `nickname_map`,

    //locks
    nickname: (nickname: string) => `nickname:${nickname}`,
    channel_join: (channelId: string, userId) => `channel_join:${channelId}:${userId}`,
    channel_leave: (channelId: string, userId) => `channel_leave:${channelId}:${userId}`
};
