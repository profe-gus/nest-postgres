import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {

  private logger = new Logger('StudentService');
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>
  ){}

  async create(createStudentDto: CreateStudentDto) {
    try{
      const student = this.studentRepository.create(createStudentDto);
      await this.studentRepository.save(student);
      return student
    }catch(error){
      this.logger.error(error);
      this.handleExceptions(error);
    }
  }

  async findAll() {
    try{
      const student = await this.studentRepository.find();
      return student;
    }catch(error){
      throw new InternalServerErrorException("La volví a embarrar");
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }

  private handleExceptions(error: any){
    if(error.code === "23505")
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unspected error, check your server');
  }
}
