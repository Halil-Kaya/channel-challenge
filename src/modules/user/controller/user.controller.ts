import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserCreateDto } from '../dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: UserCreateDto): Promise<void> {
        await this.userService.save(createUserDto);
    }
}
