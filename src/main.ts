import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { CustomValidationPipe } from './base/middleware/custome-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new CustomValidationPipe({ whitelist: true }));
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
