import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Tự động loại bỏ field lạ
      forbidNonWhitelisted: true, // Nếu gửi field lạ → THROWN ERROR
      transform: true,            // Tự động transform DTO
    }),
  );
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
