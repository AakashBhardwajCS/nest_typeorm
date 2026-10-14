import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppConfigModule } from './config/config.module.js';
import { NotFoundFilter } from './common/not-found.filter.js';
import { RequestLoggerMiddleware } from './common/request-logger.middleware.js';
import { DatabaseModule } from './database/database.module.js';
import { MongoModule } from './database/mongo.module.js';
import { CatsModule } from './cats/cats.module.js';
import { EventsModule } from './events/events.module.js';
import { FeatureModule } from './examples/feature.module.js';
import { MailModule } from './mail/mail.module.js';
import { PostsModule } from './posts/posts.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SeedModule } from './seed/seed.module.js';
import { MailerModule } from '@nestjs-modules/mailer'
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    MongoModule,
    PostsModule,
    CatsModule,
    EventsModule,
    MailModule,
    // Loaded unless EXAMPLES_ENABLED=false (waits for env vars to be loaded)
    ConditionalModule.registerWhen(FeatureModule, 'EXAMPLES_ENABLED'),
    SeedModule,
    AuthModule,
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

