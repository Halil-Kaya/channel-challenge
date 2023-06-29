import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @ApiProperty()
    fullName: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @ApiProperty()
    nickname: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @ApiProperty()
    password: string;
}

export class UserCreateAck {}
