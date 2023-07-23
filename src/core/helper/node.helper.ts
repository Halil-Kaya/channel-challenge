import { Injectable } from '@nestjs/common';
import { hostname } from 'os';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class NodeIdHelper {
    private static readonly nodeId = `${hostname()}_${randomStringGenerator()}`;

    public static getNodeId(): string {
        return this.nodeId;
    }
}
