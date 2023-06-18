export const cacheKeys = {
    user: (userId: string) => `user:${userId}`,
    nickname: (nickname: string) => `nickname:${nickname}`
};
