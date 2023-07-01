import { Injectable } from '@nestjs/common';

@Injectable()
export class AdjustPackageMiddleware {
    constructor() {}

    use(packet: [string, ...unknown[]]) {
        packet[1] = {
            payload: packet[1]
        };
    }
}
