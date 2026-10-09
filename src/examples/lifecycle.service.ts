import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class LifecycleService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown
{
  private readonly logger = new Logger(LifecycleService.name);

  onModuleInit() {
    this.logger.log('onModuleInit');
  }

  onApplicationBootstrap() {
    this.logger.log('onApplicationBootstrap');
  }

  onModuleDestroy() {
    this.logger.log('onModuleDestroy');
  }

  beforeApplicationShutdown(signal?: string) {
    this.logger.log(`beforeApplicationShutdown (${signal ?? 'no signal'})`);
  }
}
