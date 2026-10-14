import { registerAs } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

// Returns JwtModule options directly so it can be handed to
// JwtModule.registerAsync(jwtConfig.asProvider()).
export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET,
    // access token lifetime in seconds (default 1 hour)
    signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10) },
  }),
);
