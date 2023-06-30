import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFactory } from './model/user.model';
import { UserController } from './controller/user.controller';
import { UserService, UserInternalService, UserSessionInternalService } from './service';
import { UserCacheRepository, UserMongoRepository, UserRepository, UserSessionCacheRepository } from './repository';
import { LockService } from '../../core/service';

@Module({
    imports: [MongooseModule.forFeatureAsync([UserFactory])],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        UserInternalService,
        UserMongoRepository,
        UserCacheRepository,
        LockService,
        UserSessionCacheRepository,
        UserSessionInternalService
    ],
    exports: [UserInternalService, UserSessionInternalService]
})
export class UserModule {}
