import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFactory } from './model/user.model';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserCacheRepository, UserMongoRepository, UserRepository } from './repository';
import { LockService } from '../../core/service/lock.service';

@Module({
    imports: [MongooseModule.forFeatureAsync([UserFactory])],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserMongoRepository, UserCacheRepository, LockService],
    exports: [UserService]
})
export class UserModule {}
