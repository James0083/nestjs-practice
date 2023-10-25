import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//6.2 dotenv를 이용한 Config설정 - dotenv 패키지를 직접 사용하는 경우
// dotenv.config({
//   path: path.resolve(
//     (process.env.NODE_ENV === 'production') ? '.production.env'
//       : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
//   )
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3030);
}
bootstrap();
