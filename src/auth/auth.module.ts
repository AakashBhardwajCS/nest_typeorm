import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { AuthenticationGuard } from './guards/authentication.guard.js';
import { User, UserSchema } from './schemas/user.schema.js';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    // global so other modules can use AuthenticationGuard (it needs JwtService)
    JwtModule.registerAsync({ ...jwtConfig.asProvider(), global: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthenticationGuard],
  exports: [AuthenticationGuard],
})
export class AuthModule {}
