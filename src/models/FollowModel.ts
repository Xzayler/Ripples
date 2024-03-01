import mongoose from "mongoose";
import { Schema, InferSchemaType } from "mongoose";

const followSchema = new Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "posts",
  },
});

type Follow = InferSchemaType<typeof followSchema>;

export type { Follow };

export default mongoose.models?.FollowModel ||
  mongoose.model<Follow>("FollowModel", followSchema, "follows");
