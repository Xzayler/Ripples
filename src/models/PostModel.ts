import mongoose from 'mongoose';
import { Schema, InferSchemaType } from 'mongoose';

const postSchema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    // _id: { type: String, required: true },
    author: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      required: true,
      ref: 'users',
    },
    content: { type: String, required: true },
    likes: { type: Number },
    comments: { type: Number },
    reposts: { type: Number },
    parent: { type: mongoose.Schema.ObjectId, ref: 'posts' },
  },
  { timestamps: true },
);

export type InferredPost = InferSchemaType<typeof postSchema>;
export default mongoose.models?.PostModel ||
  mongoose.model<InferredPost>('PostModel', postSchema, 'posts');
