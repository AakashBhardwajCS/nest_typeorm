import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { CircularAService } from './circular-a.service.js';
import { CircularBService } from './circular-b.service.js';
import { RouteDiscoveryService } from './discovery.service.js';
import { ExampleController } from './example.controller.js';
import { API_URL, DB_VERSION } from './feature.constants.js';
import { LifecycleService } from './lifecycle.service.js';
import { RequestUserService } from './request-user.service.js';

@Module({
  imports: [DiscoveryModule],
  controllers: [ExampleController],
  providers: [
    CircularAService,
    CircularBService,
    RouteDiscoveryService,
    LifecycleService,
    RequestUserService,
    // Custom provider (value)
    { provide: API_URL, useValue: 'https://api.example.com' },
    // Asynchronous provider: Nest waits for the promise before injecting it
    {
      provide: DB_VERSION,
      inject: [DataSource],
      useFactory: async (dataSource: DataSource) => {
        const [row] = await dataSource.query('SELECT version()');
        return row.version as string;
      },
    },
  ],
})
export class FeatureModule {}
