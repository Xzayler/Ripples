import mongoose from "mongoose";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import UserModel, { InferredUser, type User } from "~/models/UserModel";
import PostModel, { type InferredPost } from "~/models/PostModel";
import CommentModel, { type InferredComment } from "~/models/CommentModel";
import LikeModel, { type InferredLike } from "~/models/LikeModel";
import FollowModel, { type Follow } from "~/models/FollowModel";
import { isServer } from "solid-js/web";
import { type Ripple } from "~/types";

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

// export async function getPosts({
//   page = 1,
//   limit = 10,
//   filter = {},
//   sort = { id: "asc" },
// }: {
//   page?: number;
//   limit?: number;
//   filter?: mongoose.FilterQuery<InferredPost>;
//   sort?: { [key: string]: mongoose.SortOrder };
// }): Promise<Post[] | null> {
//   try {
//     const skip = (page - 1) * limit;
//     const result: InferredPost[] = await PostModel.find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);

//     return result.map((res) => {
//       // return res.json();
//       return {
//         _id: res._id.toString(),
//         author_id: res.author_id.toString(),
//         createdAt: res.createdAt,
//         updatedAt: res.updatedAt,
//         content: res.content,
//       } as Post;
//     }) as Post[];
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }

export async function addPost(postData: { content: string; author: string }) {
  const id = new mongoose.Types.ObjectId();
  try {
    await PostModel.create({
      _id: id,
      ...postData,
      likes: 0,
      comments: 0,
      reposts: 0,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function addComment(postData: {
  content: string;
  author: string;
  parent: mongoose.Types.ObjectId;
}) {
  const id = new mongoose.Types.ObjectId();
  try {
    await CommentModel.create({
      _id: id,
      ...postData,
      likes: 0,
      comments: 0,
      reposts: 0,
    });
    await PostModel.updateOne(
      { _id: postData.parent },
      { $inc: { comments: 1 } }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const res: InferredUser | null = await UserModel.findById(id);
  if (!res) return null;
  return {
    _id: res._id,
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

export async function getFeed(userId: string) {
  try {
    const posts = await PostModel.aggregate([
      // { $match: {} },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          pipeline: [
            {
              $match: { user: userId },
            },
            { $limit: 1 },
          ],
          as: "likedocs",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          _id: true,
          content: true,
          author: "$author",
          createdAt: true,
          updatedAt: true,
          hasLiked: {
            $cond: {
              if: { $eq: [{ $size: "$likedocs" }, 0] },
              then: false,
              else: true,
            },
          },
          likes: true,
          comments: true,
          reposts: true,
        },
      },
    ]);

    return posts.map((post) => {
      if (post.author == null || typeof post.author == "string") {
      }
      return {
        id: post._id.toString(),
        authorName: post.author.name,
        authorHandle: post.author.handle,
        pfp: post.author.pfp,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        content: post.content,
        likes: post.likes ?? 0,
        hasLiked: post.hasLiked,
        reposts: post.reposts ?? 0,
        comments: post.comments ?? 0,
      } as Ripple;
    });
  } catch (error) {
    return error as Error;
  }
}

export async function likePost(
  postId: mongoose.Types.ObjectId,
  userId: string
) {
  try {
    await LikeModel.create({
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      post: postId,
    });
    await PostModel.updateOne({ _id: postId }, { $inc: { likes: 1 } });
  } catch (error) {
    console.log("error liking");
  }
}

export async function unlikePost(
  postId: mongoose.Types.ObjectId,
  userId: string
) {
  try {
    await LikeModel.deleteOne({ user: userId, post: postId });
    await PostModel.updateOne({ _id: postId }, { $inc: { likes: -1 } });
  } catch (error) {
    console.log("error liking");
  }
}

export async function getLike(postId: mongoose.Types.ObjectId, userId: string) {
  try {
    const like: InferredLike | null = await LikeModel.findOne({
      post: postId,
      user: userId,
    });
    return like;
  } catch (error) {
    return error;
  }
}

// export async function getLikes() {
//   try {
//     const result: Like[] = await LikeModel.find();
//     return result;
//   } catch (error) {
//     return error;
//   }
// }

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
