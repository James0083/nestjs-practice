/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  //보안정책으로 인증메일 port(208.91.112.55:465)가 block되어서 테스트 할 수 없음.
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string>{
    // console.log(dto);
    const { signupVerifyToken } = dto;
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string>{
    // console.log(dto);
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo>{
    console.log(userId);
    return await this.usersService.getUserInfo(userId);
  }
  //~
  
  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // //3.1.5 header
  // @Header('Custom', 'Test Header')
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   //3.1.4 response
  //   if (+id < 1) {
  //     // throw new NotFoundException('id는 0보다 큰 값이어야 합니다.');
  //     throw new BadRequestException('id는 0보다 큰 값이어야 합니다.');
  //   }

  //   return this.usersService.findOne(+id);
  // }

  // //3.1.6
  // @Redirect('https://nestjs.com', 301)
  // @Get('redirect/docs')
  // findOneRedirection(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
