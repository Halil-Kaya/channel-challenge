import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty()
    nickname: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @ApiProperty()
    password: string;
}

export class SignInAck {
    accessToken: string;
}
