import { Injectable } from '@nestjs/common';
import { CryptoService } from '../../../core/service';
import { SocketEmit } from '../../../core/interface';

@Injectable()
export class DecryptMiddleware {
    constructor(private readonly cryptoService: CryptoService) {}

    use(packet: [string, ...unknown[]]) {
        const { payload } = <SocketEmit<any>>packet[1];
        packet[1]['payload'] = this.cryptoService.decrypt(payload.data);
    }
}
