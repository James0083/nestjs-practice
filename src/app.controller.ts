import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ServiceB } from './service-B';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  constructor(private readonly serviceB: ServiceB) { }

  @Get('/serviceB')
  getHelloC(): string {
    return this.serviceB.getHello();
  }
}
