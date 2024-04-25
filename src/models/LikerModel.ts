import mongoose from "mongoose";
import { Schema, InferSchemaType } from "mongoose";

const likerSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "post",
  },
});

export type InferredLiker = InferSchemaType<typeof likerSchema>;

export default mongoose.models?.LikerModel ||
  mongoose.model<InferredLiker>("LikerModel", likerSchema, "likers");
