import mongoose from 'mongoose';
import { Schema, InferSchemaType } from 'mongoose';

const sessionSchema = new Schema({
  _id: { type: String, required: true },
  user_id: {
    type: String,
    required: true,
    ref: 'users',
  },
  expires_at: {
    type: Date,
    required: true,
  },
});

export type InferredUser = InferSchemaType<typeof sessionSchema>;
export type Session = Omit<InferredUser, '_id'> & {
  _id: string;
};

export default mongoose.models?.SessionModel ||
  mongoose.model<InferredUser>('SessionModel', sessionSchema, 'sessions');
