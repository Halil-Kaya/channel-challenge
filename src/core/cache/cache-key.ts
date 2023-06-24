export const cacheKeys = {
    //userId -> USER
    user: (userId: string) => `user:${userId}`,
    //Hash nickname -> userId
    nickname_map:  `nickname_map`,

    //locks
    nickname: (nickname: string) => `nickname:${nickname}`
};
