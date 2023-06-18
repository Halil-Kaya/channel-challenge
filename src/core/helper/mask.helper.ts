export const maskHelper = (payload: object, pathsToBeMasked: string[]) => {
    const targetObject = { ...payload };
    return mask(targetObject, pathsToBeMasked);
};

export const mask = (payload: object, pathsToBeMasked: string[]) => {
    Object.keys(payload).forEach((field) => {
        if (pathsToBeMasked.includes(field)) {
            delete payload[field];
        }
        if (typeof payload[field] == 'object') {
            payload[field] = maskHelper(payload[field], pathsToBeMasked);
        }
    });
    return payload;
};
