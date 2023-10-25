import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
  constructor(private readonly configService: ConfigService) {}

  // @Get()
  // getHello(): string {
  //   // return this.appService.getHello();
  //   return process.env.DATABASE_HOST;
  // }

  @Get('/db-host-from-config')
  getDatabaseHostFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }

  // 4.2 프로바이더 등록과 사용 실습예제
  // constructor(private readonly serviceB: ServiceB) { }

  // @Get('/serviceB')
  // getHelloC(): string {
  //   return this.serviceB.getHello();
  // }
}
