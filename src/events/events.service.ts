import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EVENTS_CONNECTION } from '../database/mongo.constants.js';
import { Event } from './schemas/event.schema.js';
import { ClickedLinkEvent } from './schemas/clicked-link-event.schema.js';
import { SignUpEvent } from './schemas/sign-up-event.schema.js';
import { CreateEventDto } from './dto/event.dto.js';

@Injectable()
export class EventsService {
  constructor(
    //  MULTIPLE DATABASES (2nd argument picks the named connection)
    // the base model reads every kind of event from the shared collection
    @InjectModel(Event.name, EVENTS_CONNECTION)
    private readonly eventModel: Model<Event>,

    // DISCRIMINATORS
    // each discriminator gets its own model too, which validates the fields for that kind
    @InjectModel(ClickedLinkEvent.name, EVENTS_CONNECTION)
    private readonly clickedLinkEventModel: Model<ClickedLinkEvent>,
    @InjectModel(SignUpEvent.name, EVENTS_CONNECTION)
    private readonly signUpEventModel: Model<SignUpEvent>,
  ) {}

  create({ kind, time, url, user }: CreateEventDto) {
    const when = time ? new Date(time) : new Date()

    // the discriminator model fills in "kind" for us
    if (kind === ClickedLinkEvent.name) {
      return this.clickedLinkEventModel.create({ time: when, url });
    }
    return this.signUpEventModel.create({ time: when, user });
  }

  // without a kind you get every event, with one you only get that kind
  findAll(kind?: string) {
    return this.eventModel
      .find(kind ? { kind } : {})
      .sort({ time: -1 })
      .exec()
  }
}
