export interface User {
    _id: string;
    fullName: string;
    nickname: string;
    password: string;
    isOnline: boolean;
    createdAt: Date;
}
