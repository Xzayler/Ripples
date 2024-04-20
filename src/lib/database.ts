import mongoose from "mongoose";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import UserModel, { InferredUser } from "~/models/UserModel";
import PostModel, { type InferredPost } from "~/models/PostModel";
import CommentModel, { type InferredComment } from "~/models/CommentModel";
import LikeModel, { type InferredLike } from "~/models/LikeModel";
import BookmarksModel, { type InferredBookmark } from "~/models/BookmarksModel";
import { isServer } from "solid-js/web";
import { type Ripple } from "~/types";
import FollowerModel, { InferredFollower } from "~/models/FollowerModel";
import FollowingModel, { InferredFollowing } from "~/models/FollowingModel";
import type { User } from "~/types";

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

export async function getUserById(id: string) {
  const res: InferredUser | null = await UserModel.findById(id);
  if (!res) return null;
  return {
    _id: res._id,
    password: res.password,
  };
}

export async function getUserByUsername(un: string) {
  const res: InferredUser | null = await UserModel.findOne({ handle: un });
  if (!res) return null;
  return {
    _id: res._id.toString(),
    password: res.password,
  };
}

export async function createUser(
  name: string,
  handle: string,
  password: string
) {
  const id = new mongoose.Types.ObjectId();
  const newUser: InferredUser = {
    _id: id.toString(),
    name: name,
    handle: handle,
    password: password,
    pfp: undefined,
    bio: undefined,
    followers: 0,
    following: 0,
  };
  const newBookmarks: InferredBookmark = {
    _id: id,
    posts: [],
  };
  const newFollowings: InferredFollowing = {
    _id: id,
    users: [],
  };
  const newFollowers: InferredFollower = {
    _id: id,
    users: [],
  };
  try {
    await UserModel.create(newUser);
    await BookmarksModel.create(newBookmarks);
    await FollowerModel.create(newFollowers);
    await FollowingModel.create(newFollowings);
  } catch (error) {
    return error as Error;
  }
  return null;
}

export async function getPost(userId: string, postId: mongoose.Types.ObjectId) {
  const bmId = new mongoose.Types.ObjectId(userId);
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
        // Check if the post is bookmarked by the User
        {
          $lookup: {
            from: "bookmarks",
            let: { postId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [bmId, "$_id"] },
                },
              },
              { $limit: 1 },
            ],
            as: "bookmarkdocs",
          },
        },
        { $unwind: "$bookmarkdocs" },
        // Get all comments whose parent is the post
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "parent",
            let: { posts: "$bookmarkdocs.posts" },
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
                  hasBookmarked: {
                    $cond: {
                      if: { $in: ["$_id", "$$posts"] },
                      then: true,
                      else: false,
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
            hasBookmarked: {
              $first: {
                $cond: {
                  if: { $in: ["$_id", "$bookmarkdocs.posts"] },
                  then: true,
                  else: false,
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
                  {
                    hasBookmarked: {
                      $cond: {
                        if: { $in: ["$ancestors._id", "$bookmarkdocs.posts"] },
                        then: true,
                        else: false,
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
      hasBookmarked: post.hasBookmarked,
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
          hasBookmarked: child.hasBookmarked,
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
                hasBookmarked: ancestor.hasBookmarked,
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
  const bmId = new mongoose.Types.ObjectId(userId);
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
      // Check if the post is bookmarked by the User
      {
        $lookup: {
          from: "bookmarks",
          let: { postId: "_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [bmId, "$_id"] },
              },
            },
            { $limit: 1 },
          ],
          as: "bookmarkdocs",
        },
      },
      { $unwind: "$bookmarkdocs" },
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
          hasBookmarked: {
            $cond: {
              if: { $in: ["$_id", "$bookmarkdocs.posts"] },
              then: true,
              else: false,
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
        hasBookmarked: post.hasBookmarked,
        reposts: post.reposts ?? 0,
        comments: post.comments ?? 0,
      } as Ripple;
    });
  } catch (error) {
    return error as Error;
  }
}

export async function addBookmark(
  bmId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId
) {
  try {
    await BookmarksModel.updateOne({ _id: bmId }, { $push: { posts: postId } });
  } catch (error) {
    console.log(error);
  }
}

export async function removeBookmark(
  bmId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId
) {
  try {
    await BookmarksModel.updateOne({ _id: bmId }, { $pull: { posts: postId } });
  } catch (error) {
    console.log(error);
  }
}

export async function addFollow(
  followerId: mongoose.Types.ObjectId,
  followeeId: mongoose.Types.ObjectId
) {
  try {
    await FollowerModel.updateOne(
      { _id: followeeId },
      { $push: { users: followerId } }
    );
    await FollowingModel.updateOne(
      { _id: followerId },
      { $push: { users: followeeId } }
    );
    await UserModel.updateOne({ _id: followerId }, { $inc: { following: 1 } });
    await UserModel.updateOne({ _id: followeeId }, { $inc: { followers: 1 } });
  } catch (error) {
    console.log(error);
  }
}

export async function removeFollow(
  followerId: mongoose.Types.ObjectId,
  followeeId: mongoose.Types.ObjectId
) {
  try {
    await FollowerModel.updateOne(
      { _id: followeeId },
      { $pull: { users: followerId } }
    );
    await FollowingModel.updateOne(
      { _id: followerId },
      { $pull: { users: followeeId } }
    );
    await UserModel.updateOne({ _id: followerId }, { $inc: { following: -1 } });
    await UserModel.updateOne({ _id: followeeId }, { $inc: { followers: -1 } });
  } catch (error) {
    console.log(error);
  }
}

export async function getBookmarks(bmId: mongoose.Types.ObjectId) {
  const userId = bmId.toString();
  try {
    const bookmarks = await BookmarksModel.aggregate([
      { $match: { _id: bmId } },
      {
        $unwind: "$posts",
      },
      {
        $lookup: {
          from: "posts",
          localField: "posts",
          foreignField: "_id",
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
          as: "bookmarkedPost",
        },
      },
      {
        $project: {
          _id: false,
          bookmarkedPost: true,
        },
      },
    ]);
    // @ts-ignore
    return bookmarks.map((bookmark) => {
      const bm = bookmark.bookmarkedPost[0];
      return {
        id: bm._id.toString(),
        content: bm.content,
        likes: bm.likes,
        comments: bm.comments,
        reposts: bm.reposts,
        createdAt: bm.createdAt,
        updatedAt: bm.updatedAt,
        authorName: bm.authorName,
        authorHandle: bm.authorHandle,
        hasLiked: bm.hasLiked,
        hasBookmarked: true,
      } as Ripple;
    });
  } catch (error) {
    console.log(error);
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

// export async function getComments() {
//   try {
//     const result: Comment[] = await CommentModel.find();
//     return result;
//   } catch (error) {
//     return error;
//   }
// }

export async function getUserSummary(
  uHandle: string,
  currUserId: mongoose.Types.ObjectId
) {
  try {
    const user = (
      await UserModel.aggregate([
        { $match: { handle: uHandle } },
        {
          $addFields: {
            convertedId: { $toObjectId: "$_id" },
          },
        },
        {
          $lookup: {
            from: "followings",
            localField: "convertedId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  _id: false,
                  found: {
                    $cond: {
                      if: {
                        $in: [currUserId, "$users"],
                      },
                      then: true,
                      else: false,
                    },
                  },
                },
              },
            ],
            as: "isFollowed",
          },
        },
        { $unwind: "$isFollowed" },
        {
          $project: {
            id: true,
            name: true,
            handle: true,
            pfp: true,
            bio: true,
            followers: true,
            following: true,
            isFollowed: "$isFollowed.found",
            convertedId: true,
          },
        },
      ])
    )[0];
    return {
      id: user._id.toString(),
      name: user.name,
      handle: user.handle,
      pfp: user.pfp,
      bio: user.bio ?? "",
      followers: user.followers,
      following: user.following,
      isFollowed: user.isFollowed,
    } as User;
  } catch (error) {
    console.log(error);
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
