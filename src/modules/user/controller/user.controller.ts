import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../service';
import { UpdatePasswordAck, UpdatePasswordDto, UserCreateAck, UserCreateDto } from '../dto';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { ApiException, ApiResponseSchema, CurrentUser } from '../../../core/decorator';
import { User } from '../../../core/interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NicknameAlreadyTakenException, RaceConditionException } from '../../../core/error';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiException(NicknameAlreadyTakenException, RaceConditionException)
    @ApiResponseSchema()
    @Post()
    async create(@Body() createUserDto: UserCreateDto): Promise<UserCreateAck> {
        await this.userService.save(createUserDto);
        return;
    }

    @ApiBearerAuth()
    @ApiResponseSchema()
    @UseGuards(AuthGuard)
    @Post('update-password')
    async updatePassword(
        @Body() updatePasswordDto: UpdatePasswordDto,
        @CurrentUser() user: User
    ): Promise<UpdatePasswordAck> {
        await this.userService.updatePasswrod(user, updatePasswordDto);
        return;
    }
}
