/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Param, Query, Headers, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth.guard';


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  // //3.1.9 payload다루기 - User 생성 
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   const { name, email } = createUserDto;

  //   return `유저를 생성했습니다. 이름: ${name}, 이메일: ${email}`;
  // }

  //3.2~
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void>{
    // console.log(dto);
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
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
    return await this.usersService.getUserInfo(userId);
  }
}
