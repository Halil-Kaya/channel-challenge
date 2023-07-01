import { Injectable } from '@nestjs/common';
import { CryptoService } from '../../../../core/service';

@Injectable()
export class ReqIdMiddleware {
    constructor(private readonly cryptoService: CryptoService) {}

    use(packets: [string, ...unknown[]]) {
        packets[1]['reqId'] = this.cryptoService.generateReqId();
    }
}
