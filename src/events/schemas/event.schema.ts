import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ClickedLinkEvent } from './clicked-link-event.schema.js';
import { SignUpEvent } from './sign-up-event.schema.js';

// NESTJS MONGO DOCS: DISCRIMINATORS
// the base schema. every kind of event is stored in the same "events" collection,
// and the kind field is how mongoose tells them apart (it would be called __t if we didn't set discriminatorKey)
@Schema({ discriminatorKey: 'kind' })
export class Event {
  @Prop({
    type: String,
    required: true,
    enum: [ClickedLinkEvent.name, SignUpEvent.name],
  })
  kind: string

  @Prop({ type: Date, required: true })
  time: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
