import { Controller, Get, HostParam } from '@nestjs/common';

//3.1.8 하위 도메인 라우팅
@Controller({ host: 'api.localhost' })
export class ApiController {
  @Get()
  index(): string {
    return 'Hello, API';
  }
}

@Controller({ host: ':version.api.localhost' })
export class ApiController2 {
  @Get()
  index(@HostParam('version') version: string): string {
    return `Hello, API ${version}`;
  }
}
