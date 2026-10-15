import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionAuth } from './session-auth.provider.js';
import { CredentialsService } from './credentials.service.js';

@Module({
  imports: [],
  providers: [ 
  SessionAuth,
  CredentialsService,

],
  controllers: [],
})
export class AuthModule {}