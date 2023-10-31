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
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import authConfig from './config/authConfig';

@Module({
  imports: [
    //윈도우에서 프로젝트 실행 시 dist에 env폴더가 복사되지 않는 문제가 있었음. 해결하지 못함. dist/config에 인위적으로 env폴더를 복사해주어야함. ../nest-cli.json or package.json
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST, //'localhost',
      port: 3306,
      username: process.env.DATABASE_USERNAME, //'root',
      password: process.env.DATABASE_PASSWORD, //'test',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      // migrations: [__dirname + '/**/migrations/*.js'],
      // migrationsTableName: 'migrations',
    }),
    UsersModule,
    EmailModule,
    AuthModule,
  ],
  controllers: [ApiController2, ApiController, AppController],
  providers: [AppService, BaseService, ServiceA, ServiceB, ConfigService],
})
export class AppModule {}
