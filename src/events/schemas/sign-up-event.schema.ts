import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// NESTJS MONGO DOCS: DISCRIMINATORS
// another kind of event, same deal as ClickedLinkEvent but with a user instead of a url
@Schema()
export class SignUpEvent {
  kind: string;
  time: Date;

  @Prop({ type: String, required: true })
  user: string;
}

export const SignUpEventSchema = SchemaFactory.createForClass(SignUpEvent);
