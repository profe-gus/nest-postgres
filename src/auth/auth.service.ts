import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async create(createAuthDto: CreateAuthDto) {
    const {password, ...userData } = createAuthDto;
    try{
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;

      return {
        user:user,
        token: this.getJwtToken({id: user.id})
      };


    }catch(error){
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto){
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {email},
      select: { email: true, password: true, id:true}
    });

    if(!user) throw new UnauthorizedException(`User with email ${email} not found`);

    if(!bcrypt.compareSync(password, user.password!))
      throw new UnauthorizedException(`Email or password incorrect`)

    delete user.password;

    return {
      user:user,
      token: this.getJwtToken({id: user.id})
    }
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleExceptions(error: any){
      if(error.code === "23505")
        throw new BadRequestException(error.detail);
  
      this.logger.error(error.detail);
      throw new InternalServerErrorException('Unspected error, check your server logs');
    }

}
