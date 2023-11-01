/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Param, Query, Headers, UseGuards, Inject, LoggerService, InternalServerErrorException, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth.guard';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/create-user.command';
import { GetUserInfoQuery } from './query/get-user-info.query';


@Controller('users')
export class UsersController {
  constructor(
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger, 
    // @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @Inject(Logger) private readonly logger: LoggerService,
    private usersService: UsersService,
    private authService: AuthService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) { }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void>{
    // this.printWinstonLog(dto);
    // this.printLoggerServiceLog(dto);
    const { name, email, password } = dto;
    
    // await this.usersService.createUser(name, email, password);
    
    const command = new CreateUserCommand(name, email, password);

    return this.commandBus.execute(command);
  }
  
  //$ curl http://localhost:3030/users -H "Content-Type: application/json" -X POST -d "{\"name\":\"YOUR_NAME\",\"email\":\"YOUR_EMAIL@gmail.com\",\"password\":\"YOUR_PASSWORD\"}"

  //보안정책으로 인증메일 port(208.91.112.55:465)가 block되어서 테스트 할 수 없음.
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string>{
    console.log(dto);
    const { signupVerifyToken } = dto;
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string>{
    // console.log(dto);
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  // @Get('/:id')
  // async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo>{
  //   // console.log(userId);
  //   const jwtString = headers.authorization.split('Bearer')[1];

  //   this.authService.verify(jwtString);

  //   
  // }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
    // return await this.usersService.getUserInfo(userId);
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }

  // private printWinstonLog(dto) {
  //   // console.log(this.logger.name);

  //   this.logger.error('error: ', dto);
  //   this.logger.warn('warn: ', dto);
  //   this.logger.info('info: ', dto);
  //   this.logger.http('http: ', dto);
  //   this.logger.verbose('verbose: ', dto);
  //   this.logger.debug('debug: ', dto);
  //   this.logger.silly('silly: ', dto);
  // }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ', JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }
}
