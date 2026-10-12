import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, type ConfigType } from '@nestjs/config';
import appConfig from './app.config.js';
import type { EnvironmentVariables } from './env.validation.js';

// Custom getters on top of ConfigService, so callers don't repeat
// string comparisons like `get('NODE_ENV') === 'production'`.
@Injectable()
export class AppConfigService {
  constructor(
    // `true` as the 2nd generic drops `undefined` from return types
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    @Inject(appConfig.KEY)
    private readonly app: ConfigType<typeof appConfig>,
  ) {}

  get port(): number {
    return this.configService.get('PORT', { infer: true });
  }

  get isProduction(): boolean {
    return this.configService.get('NODE_ENV', { infer: true }) === 'production';
  }

  get supportEmail(): string | undefined {
    return this.app.supportEmail;
  }
}
