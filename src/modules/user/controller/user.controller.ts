import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserCreateDto } from './dto';
import { UserCreateAck } from './ack/user-create.ack';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: UserCreateDto): Promise<UserCreateAck> {
        await this.userService.save(createUserDto);
        return;
    }
}
