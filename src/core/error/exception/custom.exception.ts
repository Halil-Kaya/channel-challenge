export class CustomException extends Error {
    message: string;
    httpStatusCode: number;
    errorCode: number;
    isCustomError = true;

    constructor(message: string, httpStatusCode: number, errorCode: number) {
        super();
        this.message = message;
        this.httpStatusCode = httpStatusCode;
        this.errorCode = errorCode;
        this.isCustomError = true;
    }
}
