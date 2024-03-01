import mongoose from "mongoose";
import { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  handle: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  pfp: { type: String, required: false },
  bio: { type: String, required: false },
});

export type InferredUser = InferSchemaType<typeof userSchema>;
export type User = Omit<InferredUser, "_id"> & {
  _id: string;
};

export default mongoose.models?.UserModel ||
  mongoose.model<InferredUser>("UserModel", userSchema, "users");
