import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import GoogleAuthConfig from './google-auth.config.js';
import { GoogleStrategy } from './strategies/google.strategy.js';
import { User } from './entities/user.entity.js';

@Module({
  imports: [
    ConfigModule.forFeature(GoogleAuthConfig),
    TypeOrmModule.forFeature([User]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
