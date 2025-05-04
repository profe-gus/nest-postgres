import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, MaxLength, MinLength } from "class-validator";

export class LoginUserDto{
    
    @ApiProperty({
        description: 'A valid email',
        nullable: false,
        required: true,
    })
    @IsString()
    @IsEmail()
    email:string;
   
    
    @ApiProperty()
    @IsString()
    @MaxLength(50)
    @MinLength(6)
    password: string;
}