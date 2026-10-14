import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import type { EnvironmentVariables } from './config/env.validation.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { swaggerDocumentOptions } from './swagger/swaggerOptions.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();

  // Lazy initialization

  // Wrapping SwaggerModule.createDocument() in a factory function defers document generation until the document is first requested, which saves initialization time.
  // The resulting document is a serializable object that conforms to the OpenAPI Document specification. Instead of serving it over HTTP, you can also save it as a JSON or YAML file and use it elsewhere.

  // the options (including the zod-openapi converter) live in src/swagger/swaggerOptions.ts
  const documentFactory = () => SwaggerModule.createDocument(app, config, swaggerDocumentOptions);
  SwaggerModule.setup('api', app, documentFactory,
    // can define opstions for swagger, where api in json can be accesssed.
    // by default the path is /api-json but we can provide a custom path
    // {
    //   jsonDocumentUrl: '/api-json',
    // }
  );

  // app.enableCors();
  // app.enableShutdownHooks();

  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  await app.listen(configService.get('PORT', { infer: true }));
}

await bootstrap();
