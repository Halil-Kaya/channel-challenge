import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @ApiProperty()
    newPassword: string;
}

export class UpdatePasswordAck {}
