import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "./entities/user.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AppModule } from "../app.module";

describe('AuthModule', () => {
    let module: TestingModule;
  
    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          PassportModule.register({ defaultStrategy: 'jwt' }),
          JwtModule.register({
            secret: 'test-secret',
            signOptions: { expiresIn: '1h' },
          }),
          AppModule,
        ],
        providers: [
          {
            provide: AuthService,
            useValue: {},
          },
          {
            provide: getRepositoryToken(User),
            useClass: Repository,
          },
          {
            provide: ConfigService,
            useValue: {},
          },
        ],
      }).compile();
    });
  
    beforeEach(() => {
      module.close();
    });
  
    it('should be defined', () => {
      expect(module).toBeDefined();
    });
  
    it('should have AuthService as provider', () => {
      const service = module.get<AuthService>(AuthService);
      expect(service).toBeDefined();
    });
  
    it('should have AuthController as controller', () => {
      const controller = module.get<AuthController>(AuthController);
      expect(controller).toBeDefined();
    });
  
    it('should have JwtStrategy as provider', () => {
      const provider = module.get<JwtStrategy>(JwtStrategy);
      expect(provider).toBeDefined();
    });
  
    it('should have JwtModule as module', () => {
      const jwtModule = module.get<JwtModule>(JwtModule);
      expect(jwtModule).toBeDefined();
    });
  });