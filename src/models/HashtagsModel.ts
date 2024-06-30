import mongoose from "mongoose";
import { Schema, InferSchemaType } from "mongoose";

const hashtagsSchema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
    index: true,
  },
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "posts",
  },
});

export type InferredHashtag = InferSchemaType<typeof hashtagsSchema>;

export default mongoose.models?.HashtagsModel ||
  mongoose.model<InferredHashtag>("HashtagsModel", hashtagsSchema, "hashtags");
