import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './command/create-user.handler';
import { LoginHandler } from './command/login.handler';
import { VerifyAccessTokenHandler } from './command/verify-access-token.handler';
import { VerifyEmailHandler } from './command/verify-email.handler';
import { UserEventsHandler } from './event/user-event.handler';

const commandHandlers = [
  CreateUserHandler,
  VerifyEmailHandler,
  LoginHandler,
  VerifyAccessTokenHandler,
];

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    ...commandHandlers,
    UserEventsHandler,
    Logger,
  ],
})
export class UsersModule { }