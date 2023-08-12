export enum ErrorCode {
    //500
    GENERAL_SERVER_ERROR = 500100,
    NICKNAME_ALREADY_TAKEN = 500101,
    INVALID_CREDENTIALS = 500102,

    //401
    UNAUTHORIZED = 40100,

    //403
    FORBIDDEN = 40300,
    USER_NOT_IN_CHANNEL = 40301,

    //404
    NOT_FOUND = 40400,
    CHANNEL_NOT_FOUND = 40401,

    //429
    RACE_CONDITION = 42900
}
