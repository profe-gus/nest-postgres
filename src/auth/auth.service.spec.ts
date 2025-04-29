import { BadRequestException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "./entities/user.entity";
import { CreateAuthDto } from "./dto/create-auth.dto";
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: Repository<User>;
  
    beforeEach(async () => {
      const mockUserRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
      };
  
      const mockJwtService = {
        sign: jest.fn().mockReturnValue('mock-jwt-token'),
      };
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: getRepositoryToken(User),
            useValue: mockUserRepository,
          },
          {
            provide: JwtService,
            useValue: mockJwtService,
          },
  
          AuthService,
        ],
      }).compile();
  
      authService = module.get<AuthService>(AuthService);
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });
  
    it('should be defined', () => {
      expect(authService).toBeDefined();
    });
  
    it('should create a user and return user with token', async () => {
      const dto: CreateAuthDto = {
        email: 'test@google.com',
        password: 'Abc123',
        fullName: 'Test User',
      };
  
      const user = {
        email: dto.email,
        fullName: dto.fullName,
        id: '1',
        isActive: true,
        roles: ['user'],
      } as User;
  
      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('ABcbjAjkhas');
  
      const result = await authService.create(dto);
  
      expect(bcrypt.hashSync).toHaveBeenCalledWith('Abc123', 10);
  
      expect(result).toEqual({
        user: {
          email: 'test@google.com',
          fullName: 'Test User',
          id: '1',
          isActive: true,
          roles: ['user'],
        },
        token: 'mock-jwt-token',
      });
    });
  
    it('should throw an error if email already exist', async () => {
      const dto: CreateAuthDto = {
        email: 'test@google.com',
        password: 'Abc123',
        fullName: 'Test User',
      };
  
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue({ code: '23505', detail: 'Email already exists' });
  
      await expect(authService.create(dto)).rejects.toThrow(BadRequestException);
      await expect(authService.create(dto)).rejects.toThrow(
        'Email already exists',
      );
    });
  

    it('should login user and return token', async () => {
      const dto: LoginUserDto = {
        email: 'gus@mail.com',
        password: 'Abc123',
      };
  
      const user = {
        ...dto,
        password: 'Abc123',
      } as User;
  
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
  
      const result = await authService.login(dto);
      expect(result).toEqual({
        user: {
          email: 'gus@mail.com',
        },
        token: 'mock-jwt-token',
      });
  
      expect(result.user.password).not.toBeDefined();
      expect(result.user.password).toBeUndefined();
    });
  
    it('should throw an UnAuthorized Exception if user doest not exist', async () => {
      const dto = { email: 'test@google.com' } as LoginUserDto;
  
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
  
      await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
      await expect(authService.login(dto)).rejects.toThrow(
        `User with email ${dto.email} not found`,
      );
    });
  
    it('should throw an UnAuthorized Exception if user doest not exist', async () => {
      const dto = { email: 'test@google.com' } as LoginUserDto;
  
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        password: 'Xyz123',
      } as User);
  
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
  
      await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
      await expect(authService.login(dto)).rejects.toThrow(
        `Email or password incorrect`,
      );
    });
  
  });