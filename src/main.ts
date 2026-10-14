import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import type { EnvironmentVariables } from './config/env.validation.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ACCESS_TOKEN_AUTH } from './auth/auth.constants.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  app.enableCors();

  // Swagger UI at /docs, raw spec at /docs-json
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest TypeORM API')
    .setVersion('1.0')
    // adds the "Authorize" button; paste the accessToken from /auth/login there
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      ACCESS_TOKEN_AUTH,
    )
    .build();
  SwaggerModule.setup('docs', app, () => SwaggerModule.createDocument(app, swaggerConfig), {
    // keep the token after a page reload
    swaggerOptions: { persistAuthorization: true },
  });

  // Needed for onModuleDestroy / beforeApplicationShutdown to run on Ctrl+C
  app.enableShutdownHooks();

  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  await app.listen(configService.get('PORT', { infer: true }));
}

await bootstrap();
