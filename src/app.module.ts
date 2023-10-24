import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController, ApiController2 } from './api/api.controller';
import { BaseService } from './base-service';
import { ServiceA } from './service-A';
import { ServiceB } from './service-B';
import { EmailService } from './email/email.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [],
  controllers: [ApiController2, ApiController, AppController, UsersController],
  providers: [AppService, BaseService, ServiceA, ServiceB, UsersService, EmailService],
})
export class AppModule {}
