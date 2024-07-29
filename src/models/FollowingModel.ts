import mongoose from 'mongoose';
import { Schema, InferSchemaType } from 'mongoose';

const followingSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  // Users who are being followed by the user above
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
});

export type InferredFollowing = InferSchemaType<typeof followingSchema>;

export default mongoose.models?.FollowingModel ||
  mongoose.model<InferredFollowing>(
    'FollowingModel',
    followingSchema,
    'followings',
  );
