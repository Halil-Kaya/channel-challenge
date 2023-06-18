import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserCreateDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    fullName: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    nickname: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}
