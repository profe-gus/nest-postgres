import { Type } from "class-transformer";
import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Grade } from "../entities/grade.entity";
import { ApiProperty } from "@nestjs/swagger";


export class CreateStudentDto {

    
    @ApiProperty()
    @IsString()
    name:string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @IsPositive()
    age: number;

    @ApiProperty()
    @IsString()
    email:string;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    subjects: string[];

    @ApiProperty({
        description: 'Student gender (Male, Female, Other)',
    })
    @IsIn(['Male', 'Female', 'Other'])
    gender: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    nickname?:string;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    grades: Grade[];
}
