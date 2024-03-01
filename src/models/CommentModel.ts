import mongoose from "mongoose";
import { Schema, InferSchemaType } from "mongoose";

const commentSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
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
  parent_comment: { type: mongoose.Schema.Types.ObjectId, ref: "comments" },
  content: { type: String, required: true },
  date: { type: Date, required: true },
});

type Comment = InferSchemaType<typeof commentSchema>;

export type { Comment };

export default mongoose.models?.CommentModel ||
  mongoose.model<Comment>("CommentModel", commentSchema, "comments");
