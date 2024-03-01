import mongoose from "mongoose";
import { Schema, InferSchemaType } from "mongoose";

const postSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  // _id: { type: String, required: true },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    // type: String,
    required: true,
    ref: "users",
  },
  content: { type: String, required: true },
  // date: { type: Date, required: true },
}, { timestamps: true });

export type InferredPost = InferSchemaType<typeof postSchema>;
export type Post = Omit<InferredPost, "_id" | "author_id"> & {
  _id: string;
  author_id: string;
};

export default mongoose.models?.PostModel ||
  mongoose.model<InferredPost>("PostModel", postSchema, "posts");
