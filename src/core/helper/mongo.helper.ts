import { hashSync } from 'bcryptjs';

export function preSave(next: any) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = hashSync(this.password, 12);
    next();
}

export const leanObjectId = (result) => {
    if (result) {
        result._id = result._id.toString();
    }
};
