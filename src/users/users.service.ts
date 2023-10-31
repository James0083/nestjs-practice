import * as uuid from 'uuid';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { ulid } from 'ulid';
import { AuthService } from 'src/auth/auth.service';

@Injectable() //Injectable 데커레이터를 선언함으로써 다른 어떤 Nest 컴포넌트에서도 주입할 수 있는 프로바이더가 됨. 별도의 scope를 지정해주지 않으면 일반적으로 싱글턴 인스턴스가 생성됨.
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private authService: AuthService,
  ) {}

  //4.3.2 회원가입
  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    console.log(userExist);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    // await this.saveUser(name, email, password, signupVerifyToken);
    // await this.saveUserUsingQueryRunner(name, email, password, signupVerifyToken);
    await this.saveUserUsingTransaction(
      name,
      email,
      password,
      signupVerifyToken,
    );

    // 업무망에서 에러가 나서 이메일 인증은 건너뜀.
    // await this.sendMemberJoinEmail(email, signupVerifyToken);
    console.log(`\n${signupVerifyToken}`);
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email: emailAddress },
    });
    console.log(emailAddress, user);
    return user !== null;
  }

  // eslint-disable-next-line prettier/prettier
  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  // eslint-disable-next-line prettier/prettier
  private async saveUserUsingQueryRunner(name: string, email: string, password: string, signupVerifyToken: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);
      // throw new InternalServerErrorException(); //일부러 에러를 발생시켜본다. -> DB에 정보가 저장되지 않는다.

      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜주어야 함
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);

      // throw new InternalServerErrorException();
    });
  }

  //4.3.3 회원가입 이메일 발송
  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  // // 4.3.4 이메일 인증
  async verifyEmail(signupVerifyToken: string): Promise<string> {
    //TODO
    //1. DB에서 signupVerifyToken으로 회원가입 처리중인 유저가 있는지 조회하고 없다면 에러처리
    //2. 바로 로그인 상태가 되도록 JWT를 발급
    // 10.5.1
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    // throw new Error('Method not implemented.');
  }

  async login(email: string, password: string): Promise<string> {
    //TODO
    //1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러처리
    //2. JWT를 발급
    const user = await this.usersRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    //TODO
    //1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러처리
    //2. 조회된 데이터를 UserInfo 타입으로 응답
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
