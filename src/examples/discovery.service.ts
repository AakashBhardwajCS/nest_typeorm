import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';

@Injectable()
export class RouteDiscoveryService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RouteDiscoveryService.name);

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onApplicationBootstrap() {
    this.logger.log(`Found handlers: ${this.getHandlers().join(', ')}`);
  }

  getHandlers() {
    return this.discoveryService
      .getControllers()
      .filter((wrapper) => wrapper.instance)
      .flatMap((wrapper) => {
        const prototype = Object.getPrototypeOf(wrapper.instance);
        return this.metadataScanner
          .getAllMethodNames(prototype)
          .map((method) => `${wrapper.name}.${method}`);
      });
  }
}
