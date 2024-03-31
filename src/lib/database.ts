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
    await PostModel.create({
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

export async function createUser(
  name: string,
  handle: string,
  password: string
) {
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

export async function getPost(userId: string, postId: mongoose.Types.ObjectId) {
  try {
    const post = (
      await PostModel.aggregate([
        {
          $match: {
            _id: postId,
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "post",
            pipeline: [
              {
                $match: {
                  user: userId,
                },
              },
              {
                $limit: 1,
              },
            ],
            as: "likedocs",
          },
        },
        // Get all comments whose parent is the post
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "parent",
            pipeline: [
              {
                // Get if user liked the child
                $lookup: {
                  from: "likes",
                  localField: "_id",
                  foreignField: "post",
                  pipeline: [
                    {
                      $match: {
                        user: userId,
                      },
                    },
                    {
                      $limit: 1,
                    },
                  ],
                  as: "childlikedocs",
                },
              },
              {
                // Get child author
                $lookup: {
                  from: "users",
                  localField: "author",
                  foreignField: "_id",
                  as: "childauthor",
                },
              },
              {
                $unwind: "$childauthor",
              },
              {
                $project: {
                  _id: true,
                  content: true,
                  authorName: "$childauthor.name",
                  authorHandle: "$childauthor.handle",
                  authorPfp: "$childauthor.pfp",
                  createdAt: true,
                  updatedAt: true,
                  hasLiked: {
                    $cond: {
                      if: {
                        $eq: [
                          {
                            $size: "$childlikedocs",
                          },
                          0,
                        ],
                      },
                      then: false,
                      else: true,
                    },
                  },
                  likes: true,
                  comments: true,
                  reposts: true,
                },
              },
            ],
            as: "children",
          },
        },
        // Get the post author's data
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        // Post author single element array unwinding
        {
          $unwind: "$author",
        },
        // Get the post's parent
        {
          $graphLookup: {
            from: "posts",
            startWith: "$parent",
            connectFromField: "parent",
            connectToField: "_id",
            as: "ancestors",
            depthField: "depth",
          },
        },
        // Process each parent.
        {
          $unwind: {
            path: "$ancestors",
            preserveNullAndEmptyArrays: true,
          },
        },
        // Get parent author
        {
          $lookup: {
            from: "users",
            localField: "ancestors.author",
            foreignField: "_id",
            as: "ancestorauthor",
          },
        },
        // Get if user liked the parent
        {
          $lookup: {
            from: "likes",
            localField: "ancestors._id",
            foreignField: "post",
            pipeline: [
              {
                $match: {
                  user: userId,
                },
              },
              {
                $limit: 1,
              },
            ],
            as: "ancestorlikedocs",
          },
        },
        // Build the output document
        {
          $group: {
            _id: "$_id",
            content: {
              $first: "$content",
            },
            authorName: {
              $first: "$author.name",
            },
            authorHandle: {
              $first: "$author.handle",
            },
            authorPfp: {
              $first: "$author.pfp",
            },
            createdAt: {
              $first: "$createdAt",
            },
            updatedAt: {
              $first: "$updatedAt",
            },
            hasLiked: {
              $first: {
                $cond: {
                  if: {
                    $eq: [
                      {
                        $size: "$likedocs",
                      },
                      0,
                    ],
                  },
                  then: false,
                  else: true,
                },
              },
            },
            likes: {
              $first: "$likes",
            },
            comments: {
              $first: "$comments",
            },
            reposts: {
              $first: "$reposts",
            },
            children: {
              $first: "$children",
            },
            ancestors: {
              $push: {
                $mergeObjects: [
                  "$ancestors",
                  {
                    authorName: {
                      $first: "$ancestorauthor.name",
                    },
                  },
                  {
                    authorHandle: {
                      $first: "$ancestorauthor.handle",
                    },
                  },
                  {
                    authorPfp: {
                      $first: "$ancestorauthor.pfp",
                    },
                  },
                  {
                    author: undefined,
                  },
                  {
                    hasLiked: {
                      $cond: {
                        if: {
                          $eq: [
                            {
                              $size: "$ancestorlikedocs",
                            },
                            0,
                          ],
                        },
                        then: false,
                        else: true,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ])
    )[0];
    if (!post) return null;
    const res = {
      id: post._id.toString(),
      authorName: post.authorName,
      authorHandle: post.authorHandle,
      pfp: post.authorPfp,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      content: post.content,
      likes: post.likes ?? 0,
      hasLiked: post.hasLiked,
      reposts: post.reposts ?? 0,
      comments: post.comments ?? 0,
      // @ts-ignore
      children: post.children.map((child) => {
        return {
          id: child._id.toString(),
          authorName: child.authorName,
          authorHandle: child.authorHandle,
          pfp: child.authorPfp,
          createdAt: child.createdAt,
          updatedAt: child.updatedAt,
          content: child.content,
          likes: child.likes,
          hasLiked: child.hasLiked,
          reposts: child.reposts,
          comments: child.comments,
        } as Ripple;
      }),
      ancestors: post.ancestors[0]._id
        ? post.ancestors
            // @ts-ignore
            .sort((a, b) => b.depth - a.depth)
            // @ts-ignore
            .map((ancestor) => {
              return {
                id: ancestor._id.toString(),
                authorName: ancestor.authorName,
                authorHandle: ancestor.authorHandle,
                pfp: ancestor.authorPfp,
                createdAt: ancestor.createdAt,
                updatedAt: ancestor.updatedAt,
                content: ancestor.content,
                likes: ancestor.likes,
                hasLiked: ancestor.hasLiked,
                reposts: ancestor.reposts,
                comments: ancestor.comments,
              } as Ripple;
            })
        : undefined,
    } as Ripple;
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getFeed(userId: string) {
  try {
    const posts = await PostModel.aggregate([
      { $match: { parent: null } },
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
