import mongoose from "mongoose";
import { Schema, InferSchemaType } from "mongoose";

const commentSchema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    // _id: { type: String, required: true },
    author: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      required: true,
      ref: "users",
    },
    content: { type: String, required: true },
    likes: { type: Number },
    comments: { type: Number },
    reposts: { type: Number },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
  },
  { timestamps: true }
);

export type InferredComment = InferSchemaType<typeof commentSchema>;

export default mongoose.models?.CommentModel ||
  mongoose.model<Comment>("CommentModel", commentSchema, "comments");
