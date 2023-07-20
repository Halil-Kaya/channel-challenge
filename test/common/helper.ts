export const sleep = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export const getRandomString = (length: number) => {
    return `#${Math.random().toString(36).substr(2, length)}`;
};

export const isSorted = (arr) => arr.every((v, i, a) => !i || a[i - 1] <= v);

export const getRandomNumber = (betweenStart: number, betweenEnd: number) => {
    return Math.floor(Math.random() * betweenEnd) + betweenStart;
};
