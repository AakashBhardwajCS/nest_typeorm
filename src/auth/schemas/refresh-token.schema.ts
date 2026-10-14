import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false })
export class RefreshToken extends Document {
    @Prop({ required: true })
    token: string;

    // unique: only one refresh token per user, logging in again replaces it
    @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    expiryDate: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
