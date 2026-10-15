import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  root: process.env.STORAGE_ROOT ?? 'storage',
  signingKey: process.env.STORAGE_SIGNING_KEY,
}));
