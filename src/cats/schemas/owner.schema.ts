import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// subdocument
// the owner lives inside the cat document
// _id: false - because we don't need a separate id for a nested object like this

@Schema({ _id: false })
export class Owner {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);
