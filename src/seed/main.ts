import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppConfigModule } from '../config/config.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { SeedModule } from './seed.module.js';
import { SeedService } from './seed.service.js';

// Minimal root for the standalone script: env config + DB connection + seeding,
// without the HTTP-only parts of AppModule.
@Module({
  imports: [AppConfigModule, DatabaseModule, SeedModule],
})
class SeedRunnerModule {}

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(SeedRunnerModule)

    // Bootstrapping the database seeding process
    const seedService = app.get(SeedService);
    await seedService.seed();

    await app.close()
}

bootstrap()
