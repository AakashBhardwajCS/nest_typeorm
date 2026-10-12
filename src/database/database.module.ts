import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../config/database.config.js';

@Module({
  imports: [
    // Partial registration: the 'database' namespace is only loaded here
    ConfigModule.forFeature(databaseConfig),
    // Turns the namespace into a { useFactory, inject } provider for TypeORM
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
  ],
})
export class DatabaseModule {}
