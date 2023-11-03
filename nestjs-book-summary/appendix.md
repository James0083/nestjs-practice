# 부록 : ormconfig.json 동적생성

[작가 GitHub - appendix](https://github.com/dextto/book-nestjs-backend/tree/main/appendix/1%20-%20ormconfig)

<aside>
💡 config.json을 사용하는 방식은 typeorm 0.3에서 제거되었다.

하지만 아직 현업에서는 0.2.x를 많이 사용하는 편이므로, 이전 버전을 사용하는 경우 참고.

</aside>

8장에서 TypeORM을 이용하여 데이터베이스를 다루는 방법을 알아봤다.

ormconfig.json을 이용하면 코드를 작성하기에는 편하지만 환경 변수 등 런타임에 값을 적용할 수 없었다.

이를 보완하기 위해서 어플리케이션이 수행되기 전에 ormconfig.json을 동적으로 생성하여 적용할 수 있는 방법을 알아보겠다.

아이디어는 프로비저닝 과정에서의 main.ts에서 부트 스트랩을 수행하기 전에 ormconfig.json 파일을 교체하는 방법이다.

```tsx
//main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import * as fs from 'fs';

async function bootstrap() {
  await makeOrmConfig();  //1

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  await app.listen(3000);
}

async function makeOrmConfig() {
  const configService = new ConfigService(process.env);  //2
  const typeormConfig = configService.getTypeOrmConfig();  //3

  if (fs.existsSync('ormconfig.json')) {
    fs.unlinkSync('ormconfig.json');  //4
  }

  fs.writeFileSync(  //5
    'ormconfig.json',
    JSON.stringify(typeormConfig, null, 2)
  );
}

bootstrap();
```

> 1) AppModule을 생성하기 전 ormconfig.json을 생성한다.
> 
> 
> 2) 환경변수에 설정된 파일을 읽어온다. 이 작업을 수행하는 ConfigService클래스를 이용한다.
> 
> 3) ormconfig.json 파일을 만들기 위한 객체를 생성한다.
> 
> 4) 소스코드 저장소에 디폴트로 저장되어 있는 파일을 삭제한다.
> 
> 5) ormconfig.json 파일을 생성한다. 파일의 내용은 typeormConfig 객체를 JSON으로 변환한 것이다.
> 

```tsx
// config.service.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();  //1

export class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }  //2

  private getValue(key: string, throwOnMissing = true): string {  //3
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  isDevelopment() {
    return this.getValue('NODE_ENV', false) === 'development';
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {  //4
    return {
      type: 'mysql',

      host: this.getValue('DATABASE_HOST'),
      port: 3306,
      username: this.getValue('DATABASE_USERNAME'),
      password: this.getValue('DATABASE_PASSWORD'),
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrationsTableName: 'migrations',
      migrations: ['src/migration/*.ts'],
      cli: {
        migrationsDir: 'src/migration',
      },
      ssl: !this.isDevelopment(),
    };
  }
}
```

> 1) dotenv를 이용하여 환경변수를 가져온다.
> 
> 
> 2) env 멤버 변수에는 process.env 객체를 할당해야 한다.
> 
> 3) 환경 변수에서 key로 셜정된 값을 읽어온다.
> 
> 4) ormconfig.json으로 저장할 객체를 생성한다.
> 

서버를 구동하면 기존 ormconfig.json 파일을 삭제하고 동적으로 생성한다. 

.env 파일의 내용을 바꾸어서 값이 제대로 적용되는지 확인해보자.