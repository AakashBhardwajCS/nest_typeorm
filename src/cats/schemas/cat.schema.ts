import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, HydratedSingleSubdocument } from 'mongoose';
import { Owner, OwnerSchema } from './owner.schema.js'

// NESTJS MONGO DOCS: MODEL INJECTION (defining the schema with @Schema, @Prop and SchemaFactory)
// NESTJS MONGO DOCS: SUBDOCUMENTS (overriding the owner type so mongoose treats it as a subdocument)
export type CatDocument = HydratedDocument<Cat, { owner: HydratedSingleSubdocument<Owner> }>

// timestamps: true gives us createdAt and updatedAt for free, similar to the date columns in the Post entity.
// virtuals are left out of JSON by default, so toJSON / toObject turn them on for API responses
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;

  // a list of tags like ['playful', 'lazy']
  @Prop([String])
  tags: string[]

  // SUBDOCUMENTS
  // nested owner object, validated with its own schema
  @Prop({ type: OwnerSchema })
  owner?: Owner;

  // VIRTUALS
  // never saved in mongo, worked out every time the cat is read
  @Virtual({
    get: function (this: Cat) {
      return this.breed ? `${this.name} (${this.breed})` : this.name;
    },
  })
  displayName: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat)
