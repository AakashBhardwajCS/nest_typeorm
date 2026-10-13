import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// NESTJS MONGO DOCS: DISCRIMINATORS
// one kind of event. kind and time come from the base Event schema,
// they're only listed here so typescript knows about them
@Schema()
export class ClickedLinkEvent {
  kind: string;
  time: Date;

  @Prop({ type: String, required: true })
  url: string;
}

export const ClickedLinkEventSchema =
  SchemaFactory.createForClass(ClickedLinkEvent);
