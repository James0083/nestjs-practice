/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Param, Query, Headers, UseGuards, Inject, LoggerService, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { AuthGuard } from 'src/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/command/create-user.command';
import { GetUserInfoQuery } from '../application/query/get-user-info.query';
import { VerifyEmailCommand } from '../application/command/verify-email.command';
import { LoginCommand } from '../application/command/login.command';


@Controller('users')
export class UsersController {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) { }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void>{
    const { name, email, password } = dto;
    
    const command = new CreateUserCommand(name, email, password);

    return this.commandBus.execute(command);
  }
  
  //$ curl http://localhost:3030/users -H "Content-Type: application/json" -X POST -d "{\"name\":\"YOUR_NAME\",\"email\":\"YOUR_EMAIL@gmail.com\",\"password\":\"YOUR_PASSWORD\"}"

  //보안정책으로 인증메일 port(208.91.112.55:465)가 block되어서 테스트 할 수 없음.
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string>{
    const { signupVerifyToken } = dto;
    const command = new VerifyEmailCommand(signupVerifyToken);

    return this.commandBus.execute(command);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string>{
    const { email, password } = dto;

    const command = new LoginCommand(email, password);

    return this.commandBus.execute(command);
  }
  
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }
}
