import mongoose from "mongoose";
import { Schema, InferSchemaType } from "mongoose";

const likeSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  user: {
    type: String,
    required: true,
    ref: "users",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "posts",
  },
});

export type InferredLike = InferSchemaType<typeof likeSchema>;
// export type Like = Omit<InferredLike, "author_id" | "post_id"> & {
//   _id: string;
//   author_id: string;
// };

export default mongoose.models?.LikeModel ||
  mongoose.model<InferredLike>("LikeModel", likeSchema, "likes");
