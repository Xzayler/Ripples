import mongoose from "mongoose";
import { Schema, InferSchemaType } from "mongoose";

const followerSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  // User who are the followers of the user above
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
});

export type InferredFollower = InferSchemaType<typeof followerSchema>;

export default mongoose.models?.FollowerModel ||
  mongoose.model<InferredFollower>(
    "FollowerModel",
    followerSchema,
    "followers"
  );
