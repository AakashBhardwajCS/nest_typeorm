import { registerAs } from '@nestjs/config';

// Inject with @Inject(googleAuthConfig.KEY) as ConfigType<typeof googleAuthConfig>
export default registerAs('googleAuth', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
}));
