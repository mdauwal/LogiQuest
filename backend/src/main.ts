import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { SecurityMiddleware } from './security/ecurity.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
  // Global validation pipe
=======
  // Security headers
  app.use(helmet());

  // Security middleware
  app.use(SecurityMiddleware);

  // Existing configurations
>>>>>>> 2572a5dcb7d004e57fe10761e2cb9443858b1eea
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

<<<<<<< HEAD
  // Global exception filter
=======
>>>>>>> 2572a5dcb7d004e57fe10761e2cb9443858b1eea
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('LogiQuest API')
    .setDescription('API for managing LogiQuest, steps, and progress')
    .setVersion('1.0')
    .addBearerAuth() // Adds authentication support
    .addTag('Users', 'Endpoints for user management')
    .addTag('Auth', 'Endpoints for authentication')
    .addTag('Puzzles', 'Endpoints for puzzles management')
    .addTag('Steps', 'Endpoints for steps management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
