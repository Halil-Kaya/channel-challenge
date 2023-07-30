export const cacheTTL = {
    channel: {
        channel: 60 * 60 * 1000
    },
    user: {
        user: 60 * 60 * 1000,
        auth: 60 * 60 * 1000,
        nickname: 60 * 60 * 1000
    },
    lock: {
        default: 1000,
        nickname: 2 * 1000,
        channel_join: 1000,
        channel_leave: 1000
    }
};
