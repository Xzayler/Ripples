import mongoose from "mongoose";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import UserModel, { InferredUser, type User } from "~/models/UserModel";
import PostModel, { type Post, type InferredPost } from "~/models/PostModel";
import CommentModel, { type Comment } from "~/models/CommentModel";
import LikeModel, { type Like } from "~/models/LikeModel";
import FollowModel, { type Follow } from "~/models/FollowModel";
import SessionModel, { type Session } from "~/models/SessionModel";
import { isServer } from "solid-js/web";

export async function initDb() {
  if (
    (!mongoose.connection ||
      mongoose.connection.readyState == 0 ||
      mongoose.connection.readyState == 99) &&
    isServer
  ) {
    await mongoose.connect(process.env.DB_CONN_STRING!, {
      dbName: process.env.DB_NAME,
    });
  }
}

export async function getPosts({
  page = 1,
  limit = 10,
  filter = {},
  sort = { id: "asc" },
}: {
  page?: number;
  limit?: number;
  filter?: mongoose.FilterQuery<InferredPost>;
  sort?: { [key: string]: mongoose.SortOrder };
}): Promise<Post[] | null> {
  try {
    const skip = (page - 1) * limit;
    const result: InferredPost[] = await PostModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return result.map((res) => {
      // return res.json();
      return {
        _id: res._id.toString(),
        author_id: res.author_id.toString(),
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        content: res.content,
      } as Post;
    }) as Post[];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function addPost(post: Post) {
  try {
    await PostModel.create(post);
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const mongoId = new mongoose.Types.ObjectId(id);
  const res: InferredUser | null = await UserModel.findById(mongoId);
  if (!res) return null;
  return {
    _id: res._id.toString(),
    name: res.name,
    handle: res.handle,
    password: res.password,
    pfp: res.pfp,
    bio: res.bio,
  } as User;
}

export async function getUserByUsername(un: string): Promise<User | null> {
  const res: InferredUser | null = await UserModel.findOne({ handle: un });
  if (!res) return null;
  return {
    _id: res._id.toString(),
    name: res.name,
    handle: res.handle,
    password: res.password,
    pfp: res.pfp,
    bio: res.bio,
  } as User;
}

export async function createUser({
  name,
  handle,
  password,
}: {
  name: string;
  password: string;
  handle: string;
}) {
  const newUser: InferredUser = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: name,
    handle: handle,
    password: password,
    pfp: undefined,
    bio: undefined,
  };
  try {
    await UserModel.create(newUser);
  } catch (error) {
    return error as Error;
  }
  return null;
}

// export const getUser = async (filter: mongoose.FilterQuery<InferredUser>) => {
//   const res: InferredUser | null = await UserModel.findOne(filter);
//   if (!res) return null;
//   return {
//     _id: res._id.toString(),
//     name: res.name,
//     handle: res.handle,
//     password: res.password,
//     pfp: res.pfp,
//     bio: res.bio,
//   };
// };

export async function getLikes() {
  try {
    const result: Like[] = await LikeModel.find();
    return result;
  } catch (error) {
    return error;
  }
}

export async function getComments() {
  try {
    const result: Comment[] = await CommentModel.find();
    return result;
  } catch (error) {
    return error;
  }
}

export const getAdapter = async () => {
  if (!mongoose.connection) {
    await initDb();
  }
  return new MongodbAdapter(
    // @ts-ignore
    mongoose.connection.collection("sessions"),
    mongoose.connection.collection("users")
  );
};
