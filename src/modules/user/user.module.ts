import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFactory } from './model/user.model';

@Module({
    imports: [MongooseModule.forFeatureAsync([UserFactory])],
    controllers: [],
    providers: []
})
export class UserModule {}
