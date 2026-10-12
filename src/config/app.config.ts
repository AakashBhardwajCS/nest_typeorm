import { registerAs } from '@nestjs/config';

// Namespaced config: read with configService.get('app.port')
// or inject with @Inject(appConfig.KEY) as ConfigType<typeof appConfig>.
export default registerAs('app', () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  url: process.env.APP_URL ?? 'http://localhost:3000',
  supportEmail: process.env.SUPPORT_EMAIL,
}));
