import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EVENTS_CONNECTION } from '../database/mongo.constants.js';
import { Event, EventSchema } from './schemas/event.schema.js';
import {
  ClickedLinkEvent,
  ClickedLinkEventSchema,
} from './schemas/clicked-link-event.schema.js';
import { SignUpEvent, SignUpEventSchema } from './schemas/sign-up-event.schema.js';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';

@Module({
  imports: [
    // NESTJS MONGO DOCS: DISCRIMINATORS
    // the discriminators are registered together with the base model, they all share one collection
    MongooseModule.forFeature(
      [
        {
          name: Event.name,
          schema: EventSchema,
          discriminators: [
            { name: ClickedLinkEvent.name, schema: ClickedLinkEventSchema },
            { name: SignUpEvent.name, schema: SignUpEventSchema },
          ],
        },
      ],
      // NESTJS MONGO DOCS: MULTIPLE DATABASES
      // the 2nd argument tells nest to put these models on the events connection, not the default one
      EVENTS_CONNECTION,
    ),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
