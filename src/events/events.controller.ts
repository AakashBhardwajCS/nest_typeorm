import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateEventDto, EVENT_KINDS } from './dto/event.dto.js';
import { EventsService } from './events.service.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() event: CreateEventDto) {
    return this.eventsService.create(event)
  }

  // GET /events or GET /events?kind=SignUpEvent
  @Get()
  findAll(@Query('kind') kind?: string) {
    
    if (kind && !EVENT_KINDS.includes(kind)) {
      throw new BadRequestException(`kind must be one of: ${EVENT_KINDS.join(', ')}`);
    }
    return this.eventsService.findAll(kind);
  }
}
