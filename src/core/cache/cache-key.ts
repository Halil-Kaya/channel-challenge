export const cacheKeys = {
    //userId -> User, Expires
    user: (userId: string) => `user:${userId}`,

    //channelId -> Channel, Expires
    channel: (channelId: string) => `channel:${channelId}`,

    //userId -> UserSession
    session_user: (userId: string) => `user_sessions:${userId}`,

    //Hash nickname -> userId
    nickname_map: `nickname_map`,

    //locks
    nickname: (nickname: string) => `nickname:${nickname}`,
    channel_join: (channelId: string, userId) => `channel_join:${channelId}:${userId}`
};
