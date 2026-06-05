import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const puerto = process.env.PORT ?? 3001;

  await app.listen(puerto);

  console.log(`Servidor corriendo en: http://localhost:${puerto}`);
}

bootstrap();