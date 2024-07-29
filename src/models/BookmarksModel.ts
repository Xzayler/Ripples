import mongoose from 'mongoose';
import { Schema, InferSchemaType } from 'mongoose';

const bookmarksSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
});

export type InferredBookmark = InferSchemaType<typeof bookmarksSchema>;

export default mongoose.models?.BookmarksModel ||
  mongoose.model<InferredBookmark>(
    'BookmarksModel',
    bookmarksSchema,
    'bookmarks',
  );
