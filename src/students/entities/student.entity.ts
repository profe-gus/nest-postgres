import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Grade } from "./grade.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Student {

    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Student ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    
    @ApiProperty({
        example: 'Gus Gonzalez',
        description: `Student's name`,
    })
    @Column('text')
    name:string;


    @ApiProperty({
        example: '33',
        description: `Student's age`,
        nullable: true
    })
    @Column({
        type:'int',
        nullable: true
    })
    age: number;

    @ApiProperty({
        example: 'gus@mail.com',
        description: `Student's email`,
        uniqueItems: true
    })
    @Column({
        type: 'text',
        unique: true
    })
    email: string;


    @ApiProperty({
        example: ['Math','English','P.E'],
        description: 'Subjects',
    })
    @Column({
        type: 'text',
        array: true
    })
    subjects: string[];


    @ApiProperty({
        example: 'Other',
        description: 'Student gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        unique:true,
        nullable: true
    })
    nickname?: string

    @ApiProperty()
    @OneToMany(
        () => Grade,
        (grade) => grade.student,
        {cascade:true, eager: true}
    )
    grades?: Grade[]

    @BeforeInsert()
    checkNicknameInsert(){
        if(!this.nickname){
            this.nickname = this.name;
          }
    
          this.nickname = this.nickname
                                        .toLowerCase()
                                        .replaceAll(" ", "_")
                                        +this.age;
    }
    
    @BeforeUpdate()
    checkNickNameUpdate(){
        this.nickname = this.nickname!
                                        .toLowerCase()
                                        .replaceAll(" ", "_")
                                        +this.age;
    }
}
