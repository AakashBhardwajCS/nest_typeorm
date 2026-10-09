import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { NotFoundFilter } from './common/not-found.filter.js';
import { RequestLoggerMiddleware } from './common/request-logger.middleware.js';
import { DatabaseModule } from './database/database.module.js';
import { FeatureModule } from './examples/feature.module.js';
import { PostsModule } from './posts/posts.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    DatabaseModule.forRoot({
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 5435),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'qdeck_demo',
      synchronize: process.env.DB_SYNC === 'true',
    }),
    PostsModule,
    FeatureModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
    // Register Nest's built-in ValidationPipe globally for all routes.
    // It validates DTOs using their validation decorators.
    // Custom pipes can also be created as classes implementing PipeTransform.
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
    { provide: APP_FILTER, useClass: NotFoundFilter },
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // apply the request logger middleware to all routes
    consumer.apply(RequestLoggerMiddleware).forRoutes('*path');
  }
}

