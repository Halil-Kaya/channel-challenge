import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFactory } from './model/user.model';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserCacheRepository, UserMongoRepository, UserRepository } from './repository';
import { RedisLockModule } from '@huangang/nestjs-simple-redis-lock';

@Module({
    imports: [MongooseModule.forFeatureAsync([UserFactory]), RedisLockModule.register({})],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserMongoRepository, UserCacheRepository]
})
export class UserModule {}
