import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service';
import { UserCreateAck, UserCreateDto } from '../dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: UserCreateDto): Promise<UserCreateAck> {
        await this.userService.save(createUserDto);
        return;
    }
}
