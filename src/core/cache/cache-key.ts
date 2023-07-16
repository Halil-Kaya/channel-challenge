export const cacheKeys = {
    //userId -> USER, Expires
    user: (userId: string) => `user:${userId}`,

    //channelId -> CHANNEL, Expires
    channel: (channelId: string) => `channel:${channelId}`,

    //Hash userId -> nickname
    session_user: `user_sessions_map`,

    //Hash nickname -> userId
    nickname_map: `nickname_map`,

    //locks
    nickname: (nickname: string) => `nickname:${nickname}`
};
