import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  // constructor injection of the service into the controller
  constructor(private readonly appService: AppService) {}

  // defining a basic get route that returns a string from the service
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
