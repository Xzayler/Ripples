import mongoose from "mongoose";
import { Schema, InferSchemaType } from "mongoose";

const likeSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "posts",
  },
});

export type InferredLike = InferSchemaType<typeof likeSchema>;

export default mongoose.models?.LikeModel ||
  mongoose.model<InferredLike>("LikeModel", likeSchema, "likes");
