import { Controller, Get, Inject } from '@nestjs/common';
import { LazyModuleLoader, ModuleRef } from '@nestjs/core';
import { GetUser } from '../common/user.decorator.js';
import type { RequestUser } from '../common/user.types.js';
import { CircularAService } from './circular-a.service.js';
import { RouteDiscoveryService } from './discovery.service.js';
import { RequestUserService } from './request-user.service.js';
import { API_URL, DB_VERSION } from './feature.constants.js';

@Controller('examples')
export class ExampleController {
  constructor(
    @Inject(API_URL) private readonly apiUrl: string,
    @Inject(DB_VERSION) private readonly dbVersion: string,
    private readonly requestUser: RequestUserService,
    private readonly moduleRef: ModuleRef,
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) {}

  @Get()
  getExamples() {
    return {
      apiUrl: this.apiUrl,
      dbVersion: this.dbVersion,
      role: this.requestUser.getRole(),
    };
  }

  @Get('me')
  me(@GetUser() user?: RequestUser) {
    return user ?? { role: 'guest' };
  }

  @Get('circular')
  circular() {
    return this.moduleRef.get(CircularAService).getMessage();
  }

  @Get('handlers')
  handlers() {
    return this.moduleRef.get(RouteDiscoveryService).getHandlers();
  }

  @Get('lazy')
  async lazy() {
    const { LazyModule, PostStatsService } = await import('./lazy.module.js');
    const lazyModuleRef = await this.lazyModuleLoader.load(() => LazyModule);
    return lazyModuleRef.get(PostStatsService).getStats();
  }
}
