import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // return this.appService.getHello();
    return process.env.DATABASE_HOST;
  }

  // constructor(private readonly serviceB: ServiceB) { }

  // @Get('/serviceB')
  // getHelloC(): string {
  //   return this.serviceB.getHello();
  // }
}
