import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateStudentDto {

    @IsString()
    name:string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    age: number;

    @IsString()
    email:string;

    @IsString({ each: true })
    @IsArray()
    subjects: string[];

    @IsIn(['Male', 'Female', 'Other'])
    gender: string;
}
