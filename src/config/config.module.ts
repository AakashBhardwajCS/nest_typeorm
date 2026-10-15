import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config.js';
import { AppConfigService } from './app-config.service.js';
import { validate } from './env.validation.js';
import storageConfig from './storage.config.js';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      // ConfigService is injectable everywhere without re-importing
      isGlobal: true,
      // First file wins when a variable is defined in more than one
      envFilePath: ['.env.local', '.env'],
      // Cache process.env lookups
      cache: true,
      // Allow ${VAR} references inside .env values
      expandVariables: true,
      load: [appConfig, storageConfig],
      validate,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
