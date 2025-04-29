import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {

    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    @MaxLength(50)
    @MinLength(6)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
          'The password must have a Uppercase, lowercase letter and a number',
      })
    password: string;

    @IsString()
    fullName: string;
}
