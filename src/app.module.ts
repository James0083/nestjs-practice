import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController, ApiController2 } from './api/api.controller';
import { BaseService } from './base-service';
import { ServiceA } from './service-A';
import { ServiceB } from './service-B';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';

@Module({
  imports: [
    // //6.3 Nest에서 제공하는 Config 패키지 설정
    // ConfigModule.forRoot({
    //   envFilePath: (process.env.NODE_ENV === 'production') ? '.production.env'
    //     : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
    // }),
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    UsersModule,
    EmailModule,
  ],
  controllers: [ApiController2, ApiController, AppController],
  providers: [AppService, BaseService, ServiceA, ServiceB, ConfigService],
})
export class AppModule {}
