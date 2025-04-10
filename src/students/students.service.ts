import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/commons/dto/pagination.dto';
import { NotFoundError } from 'rxjs';
import { isUUID } from 'class-validator';
import { Grade } from './entities/grade.entity';

@Injectable()
export class StudentsService {

  private logger = new Logger('StudentService');
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>
  ){}

  async create(createStudentDto: CreateStudentDto) {
    try{
      const { grades=[], ...studentDetails }  = createStudentDto;

      const student = this.studentRepository.create({
        ...studentDetails,
        grades : grades.map( grade => this.gradeRepository.create(grade))
      });
      await this.studentRepository.save(student);
      return student;

    }catch(error){
      this.logger.error(error.detail);
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try{
      const {limit=10, offset=0 } = paginationDto;
      return await this.studentRepository.find({
        take: limit,
        skip: offset
      });
    }catch(error){
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {

    let student: Student | null;

    if(isUUID(term)){
      student = await this.studentRepository.findOneBy({ id: term });
    }else{
      const queryBuilder = this.studentRepository.createQueryBuilder();
      student = await queryBuilder.where('UPPER(name)=:name or nickname=:nickname',{
        name: term.toUpperCase(),
        nickname: term.toLowerCase()
      }).getOne();
    }


      if(!student)
        throw new NotFoundException(`Student with ${term} not found`);

      return student;
    
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.preload({
      id:id,
      ...updateStudentDto
    })

    if(!student) throw new NotFoundException(`Student with id ${id} not found`);

    try{
      await this.studentRepository.save(student);
      return student;
    }catch(error){
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  private handleExceptions(error: any){
    if(error.code === "23505")
      throw new BadRequestException(error.detail);

    this.logger.error(error.detail);
    throw new InternalServerErrorException('Unspected error, check your server');
  }
}
