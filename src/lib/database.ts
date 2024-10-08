import mongoose from 'mongoose';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import UserModel, { InferredUser } from '~/models/UserModel';
import PostModel from '~/models/PostModel';
import LikeModel, { type InferredLike } from '~/models/LikeModel';
import LikerModel from '~/models/LikerModel';
import BookmarksModel, { type InferredBookmark } from '~/models/BookmarksModel';
import { isServer } from 'solid-js/web';
import FollowerModel, { InferredFollower } from '~/models/FollowerModel';
import FollowingModel, { InferredFollowing } from '~/models/FollowingModel';
import HashtagsModel, { InferredHashtag } from '~/models/HashtagsModel';
import type { User, Ripple } from '~/types';
import { uploadPfp } from './cloudinary';
import { processPost } from './postParsing';

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

export async function getCurrentUser(id: string) {
  const currU: InferredUser = (
    await UserModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $project: {
          _id: true,
          name: true,
          handle: true,
          pfp: true,
        },
      },
    ])
  )[0];
  return {
    id: currU._id.toString(),
    handle: currU.handle,
    name: currU.name,
    pfp: currU.pfp,
  } as Omit<User, 'isFollowed' | 'followers' | 'following' | 'bio'>;
}

export async function addPost(
  id: mongoose.Types.ObjectId,
  postData: { content: string; author: string },
) {
  const { hashtags } = processPost(postData.content);
  try {
    await Promise.all([
      PostModel.create({
        _id: id,
        ...postData,
        likes: 0,
        comments: 0,
        reposts: 0,
      }),
      LikerModel.create({ _id: id, users: [] }),
      addHashtags(id, hashtags),
    ]);
  } catch (e) {
    console.log(e);
  }
}

export async function addComment(
  id: mongoose.Types.ObjectId,
  postData: {
    content: string;
    author: string;
    parent: mongoose.Types.ObjectId;
  },
) {
  const { hashtags } = processPost(postData.content);
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
      { $inc: { comments: 1 } },
    );
    await addHashtags(id, hashtags);
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
  password: string,
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
  const newLikes: InferredLike = {
    _id: id,
    posts: [],
  };
  try {
    await Promise.allSettled([
      UserModel.create(newUser).catch((err) => {
        console.log('Creating User failed');
        console.log(err);
      }),
      BookmarksModel.create(newBookmarks).catch((err) => {
        console.log('Creating Bookmarks failed');
        console.log(err);
      }),
      FollowerModel.create(newFollowers).catch((err) => {
        console.log('Creating Follower failed');
        console.log(err);
      }),
      FollowingModel.create(newFollowings).catch((err) => {
        console.log('Creating Following failed');
        console.log(err);
      }),
      LikeModel.create(newLikes).catch((err) => {
        console.log('Creating Likes failed');
        console.log(err);
      }),
    ]);
  } catch (error) {
    console.log(error);
  }
}

export async function getPost(userId: string, postId: mongoose.Types.ObjectId) {
  const uObjId = new mongoose.Types.ObjectId(userId);
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
            from: 'likes',
            pipeline: [
              {
                $match: {
                  _id: uObjId,
                },
              },
            ],
            as: 'likedPosts',
          },
        },
        {
          $unwind: {
            path: '$likedPosts',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            likedPosts: '$likedPosts.posts',
          },
        },
        // Check if the post is bookmarked by the User
        {
          $lookup: {
            from: 'bookmarks',
            let: {
              postId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  _id: uObjId,
                },
              },
            ],
            as: 'bookmarkedPosts',
          },
        },
        {
          $unwind: {
            path: '$bookmarkedPosts',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            bookmarkedPosts: '$bookmarkedPosts.posts',
          },
        },
        // Get all comments whose parent is the post
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'parent',
            let: {
              bookmarkedPosts: '$bookmarkedPosts',
              likedPosts: '$likedPosts',
            },
            pipeline: [
              {
                // Get child author
                $lookup: {
                  from: 'users',
                  localField: 'author',
                  foreignField: '_id',
                  as: 'childauthor',
                },
              },
              {
                $unwind: '$childauthor',
              },
              {
                $project: {
                  _id: true,
                  content: true,
                  authorName: '$childauthor.name',
                  authorHandle: '$childauthor.handle',
                  authorPfp: '$childauthor.pfp',
                  createdAt: true,
                  updatedAt: true,
                  hasLiked: {
                    $cond: {
                      if: { $in: ['$_id', '$$likedPosts'] },
                      then: true,
                      else: false,
                    },
                  },
                  hasBookmarked: {
                    $cond: {
                      if: { $in: ['$_id', '$$bookmarkedPosts'] },
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
            as: 'children',
          },
        },
        // Get the post author's data
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
        // Post author single element array unwinding
        {
          $unwind: '$author',
        },
        // Get the post's parent
        {
          $graphLookup: {
            from: 'posts',
            startWith: '$parent',
            connectFromField: 'parent',
            connectToField: '_id',
            as: 'ancestors',
            depthField: 'depth',
          },
        },
        // Process each parent.
        {
          $unwind: {
            path: '$ancestors',
            preserveNullAndEmptyArrays: true,
          },
        },
        // Get parent author
        {
          $lookup: {
            from: 'users',
            localField: 'ancestors.author',
            foreignField: '_id',
            as: 'ancestorauthor',
          },
        },
        // Build the output document
        {
          $group: {
            _id: '$_id',
            content: {
              $first: '$content',
            },
            authorName: {
              $first: '$author.name',
            },
            authorHandle: {
              $first: '$author.handle',
            },
            authorPfp: {
              $first: '$author.pfp',
            },
            createdAt: {
              $first: '$createdAt',
            },
            updatedAt: {
              $first: '$updatedAt',
            },
            hasLiked: {
              $first: {
                $cond: {
                  if: { $in: ['$_id', '$likedPosts'] },
                  then: true,
                  else: false,
                },
              },
            },
            hasBookmarked: {
              $first: {
                $cond: {
                  if: { $in: ['$_id', '$bookmarkedPosts'] },
                  then: true,
                  else: false,
                },
              },
            },
            likes: {
              $first: '$likes',
            },
            comments: {
              $first: '$comments',
            },
            reposts: {
              $first: '$reposts',
            },
            children: {
              $first: '$children',
            },
            ancestors: {
              $push: {
                $mergeObjects: [
                  '$ancestors',
                  {
                    authorName: {
                      $first: '$ancestorauthor.name',
                    },
                  },
                  {
                    authorHandle: {
                      $first: '$ancestorauthor.handle',
                    },
                  },
                  {
                    authorPfp: {
                      $first: '$ancestorauthor.pfp',
                    },
                  },
                  {
                    author: undefined,
                  },
                  {
                    hasLiked: {
                      $cond: {
                        if: { $in: ['$ancestors._id', '$likedPosts'] },
                        then: true,
                        else: false,
                      },
                    },
                  },
                  {
                    hasBookmarked: {
                      $cond: {
                        if: { $in: ['$ancestors._id', '$bookmarkedPosts'] },
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
  const uObjId = new mongoose.Types.ObjectId(userId);
  try {
    const posts = await PostModel.aggregate([
      {
        $match: {
          parent: null,
        },
      },
      {
        $lookup: {
          from: 'likes',
          pipeline: [
            {
              $match: {
                _id: uObjId,
              },
            },
          ],
          as: 'likedPosts',
        },
      },
      {
        $unwind: {
          path: '$likedPosts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          likedPosts: '$likedPosts.posts',
        },
      },
      // Check if the post is bookmarked by the User
      {
        $lookup: {
          from: 'bookmarks',
          let: {
            postId: '$_id',
          },
          pipeline: [
            {
              $match: {
                _id: uObjId,
              },
            },
          ],
          as: 'bookmarkedPosts',
        },
      },
      {
        $unwind: {
          path: '$bookmarkedPosts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          bookmarkedPosts: '$bookmarkedPosts.posts',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      {
        $project: {
          _id: true,
          content: true,
          author: '$author',
          createdAt: true,
          updatedAt: true,
          hasLiked: {
            $cond: {
              if: {
                $in: ['$_id', '$likedPosts'],
              },
              then: true,
              else: false,
            },
          },
          hasBookmarked: {
            $cond: {
              if: {
                $in: ['$_id', '$bookmarkedPosts'],
              },
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
    console.log(error);
    return [] as Ripple[];
  }
}

export async function getUserPosts(
  userId: string,
  uObjId: mongoose.Types.ObjectId,
) {
  const currUserIdString = uObjId.toString();
  try {
    const posts = await PostModel.aggregate([
      { $match: { $and: [{ author: userId }, { parent: null }] } },
      {
        $lookup: {
          from: 'likes',
          pipeline: [
            {
              $match: {
                _id: uObjId,
              },
            },
          ],
          as: 'likedPosts',
        },
      },
      {
        $unwind: {
          path: '$likedPosts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          likedPosts: '$likedPosts.posts',
        },
      },
      // Check if the post is bookmarked by the User
      {
        $lookup: {
          from: 'bookmarks',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: { _id: uObjId },
            },
          ],
          as: 'bookmarkedPosts',
        },
      },
      {
        $unwind: {
          path: '$bookmarkedPosts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          bookmarkedPosts: '$bookmarkedPosts.posts',
        },
      },
      // User is looked up every time even though we know the author is always the same.
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      {
        $project: {
          _id: true,
          content: true,
          author: '$author',
          createdAt: true,
          updatedAt: true,
          hasLiked: {
            $cond: {
              if: { $in: ['$_id', '$likedPosts'] },
              then: true,
              else: false,
            },
          },
          hasBookmarked: {
            $cond: {
              if: { $in: ['$_id', '$bookmarkedPosts'] },
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
    console.log(error);
    return [] as Ripple[];
  }
}

export async function getUserLikedPosts(
  userId: string,
  currUObjId: mongoose.Types.ObjectId,
) {
  const uObjId = new mongoose.Types.ObjectId(userId);
  try {
    const posts = await LikeModel.aggregate([
      {
        $match: {
          _id: uObjId,
        },
      },
      {
        $lookup: {
          from: 'likes',
          pipeline: [
            {
              $match: {
                _id: currUObjId,
              },
            },
          ],
          as: 'likedPosts',
        },
      },
      {
        $unwind: {
          path: '$likedPosts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          likedPosts: '$likedPosts.posts',
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'posts',
          foreignField: '_id',
          as: 'post',
        },
      },
      {
        $lookup: {
          from: 'bookmarks',
          let: {
            postId: '$_id',
          },
          pipeline: [
            {
              $match: {
                _id: currUObjId,
              },
            },
          ],
          as: 'bookmarkedPosts',
        },
      },
      {
        $unwind: {
          path: '$bookmarkedPosts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          bookmarkedPosts: '$bookmarkedPosts.posts',
        },
      },
      {
        $project: {
          _id: false,
          posts: false,
        },
      },
      {
        $unwind: {
          path: '$post',
        },
      },
      {
        $project: {
          _id: '$post._id',
          author: '$post.author',
          content: '$post.content',
          reposts: '$post.reposts',
          updataedAt: '$post.updatedAt',
          createdAt: '$post.createdAt',
          likes: '$post.likes',
          comments: '$post.comments',
          hasLiked: {
            $cond: {
              if: {
                $in: ['$post._id', '$likedPosts'],
              },
              then: true,
              else: false,
            },
          },
          hasBookmarked: {
            $cond: {
              if: {
                $in: ['$post._id', '$bookmarkedPosts'],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
        },
      },
      {
        $project: {
          _id: true,
          content: true,
          author: '$author',
          createdAt: true,
          updatedAt: true,
          likes: true,
          comments: true,
          reposts: true,
          hasLiked: true,
          hasBookmarked: true,
        },
      },
    ]);
    return posts.map((post) => {
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
    console.log(error);
    return [] as Ripple[];
  }
}

export async function getSubFeed(userId: string) {
  const uObjId = new mongoose.Types.ObjectId(userId);
  try {
    const posts = await FollowingModel.aggregate([
      {
        $match: { _id: uObjId },
      },
      {
        $lookup: {
          from: 'likes',
          pipeline: [
            {
              $match: {
                _id: uObjId,
              },
            },
          ],
          as: 'likedPosts',
        },
      },
      {
        $unwind: {
          path: '$likedPosts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          likedPosts: '$likedPosts.posts',
        },
      },
      // Check if the post is bookmarked by the User
      {
        $lookup: {
          from: 'bookmarks',
          pipeline: [
            {
              $match: { _id: uObjId },
            },
          ],
          as: 'bookmarkedPosts',
        },
      },
      {
        $unwind: { path: '$bookmarkedPosts', preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          bookmarkedPosts: '$bookmarkedPosts.posts',
        },
      },
      {
        $lookup: {
          from: 'posts',
          let: {
            users: '$users',
            likedPosts: '$likedPosts',
            bookmarkedPosts: '$bookmarkedPosts',
          },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    parent: null,
                  },
                  {
                    $expr: {
                      $cond: {
                        if: {
                          $in: [{ $toObjectId: '$author' }, '$$users'],
                        },
                        then: true,
                        else: false,
                      },
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
              },
            },
            {
              $unwind: '$author',
            },
            {
              $project: {
                _id: true,
                content: true,
                author: '$author',
                createdAt: true,
                updatedAt: true,
                hasLiked: {
                  $cond: {
                    if: { $in: ['$_id', '$$likedPosts'] },
                    then: true,
                    else: false,
                  },
                },
                hasBookmarked: {
                  $cond: {
                    if: { $in: ['$_id', '$$bookmarkedPosts'] },
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
          as: 'followedPosts',
        },
      },
      {
        $project: {
          _id: false,
          users: false,
        },
      },
      { $unwind: '$followedPosts' },
      {
        $project: {
          _id: '$followedPosts._id',
          author: '$followedPosts.author',
          createdAt: '$followedPosts.createdAt',
          updatedAt: '$followedPosts.updatedAt',
          content: '$followedPosts.content',
          likes: '$followedPosts.likes',
          hasLiked: '$followedPosts.hasLiked',
          hasBookmarked: '$followedPosts.hasBookmarked',
          reposts: '$followedPosts.reposts',
          comments: '$followedPosts.comments',
        },
      },
    ]);
    return posts.map((post) => {
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
    console.log(error);
    return [] as Ripple[];
  }
}

export async function addBookmark(
  bmId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId,
) {
  try {
    await BookmarksModel.updateOne({ _id: bmId }, { $push: { posts: postId } });
  } catch (error) {
    console.log(error);
  }
}

export async function removeBookmark(
  bmId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId,
) {
  try {
    await BookmarksModel.updateOne({ _id: bmId }, { $pull: { posts: postId } });
  } catch (error) {
    console.log(error);
  }
}

export async function getBookmarks(uObjId: mongoose.Types.ObjectId) {
  const userId = uObjId.toString();
  try {
    const bookmarks = await BookmarksModel.aggregate([
      { $match: { _id: uObjId } },
      {
        $lookup: {
          from: 'likes',
          pipeline: [
            {
              $match: {
                _id: uObjId,
              },
            },
          ],
          as: 'likedPosts',
        },
      },
      {
        $unwind: {
          path: '$likedPosts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          likedPosts: '$likedPosts.posts',
        },
      },
      // { $unwind: "$likedPosts" },
      {
        $unwind: '$posts',
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'posts',
          foreignField: '_id',
          let: { likedPosts: '$likedPosts' },
          pipeline: [
            // Check if the post is bookmarked by the User
            {
              // Get author
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
              },
            },
            {
              $unwind: '$author',
            },
            {
              $project: {
                _id: true,
                content: true,
                authorName: '$author.name',
                authorHandle: '$author.handle',
                authorPfp: '$author.pfp',
                createdAt: true,
                updatedAt: true,
                hasLiked: {
                  $cond: {
                    if: { $in: ['$_id', '$$likedPosts'] },
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
          as: 'bookmarkedPost',
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
        pfp: bm.authorPfp,
        hasLiked: bm.hasLiked,
        hasBookmarked: true,
      } as Ripple;
    });
  } catch (error) {
    console.log(error);
    return [] as Ripple[];
  }
}

export async function addFollow(
  followerId: mongoose.Types.ObjectId,
  followeeId: mongoose.Types.ObjectId,
) {
  try {
    await FollowerModel.updateOne(
      { _id: followeeId },
      { $push: { users: followerId } },
    );
    await FollowingModel.updateOne(
      { _id: followerId },
      { $push: { users: followeeId } },
    );
    await UserModel.updateOne({ _id: followerId }, { $inc: { following: 1 } });
    await UserModel.updateOne({ _id: followeeId }, { $inc: { followers: 1 } });
  } catch (error) {
    console.log(error);
  }
}

export async function removeFollow(
  followerId: mongoose.Types.ObjectId,
  followeeId: mongoose.Types.ObjectId,
) {
  try {
    await FollowerModel.updateOne(
      { _id: followeeId },
      { $pull: { users: followerId } },
    );
    await FollowingModel.updateOne(
      { _id: followerId },
      { $pull: { users: followeeId } },
    );
    await UserModel.updateOne({ _id: followerId }, { $inc: { following: -1 } });
    await UserModel.updateOne({ _id: followeeId }, { $inc: { followers: -1 } });
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(
  postId: mongoose.Types.ObjectId,
  userId: string,
) {
  const uObjId = new mongoose.Types.ObjectId(userId);
  try {
    await Promise.all([
      LikerModel.updateOne({ _id: postId }, { $push: { users: uObjId } }).catch(
        (err) => {
          console.log('Liker update failed');
          console.log(err);
        },
      ),
      LikeModel.updateOne({ _id: uObjId }, { $push: { posts: postId } }).catch(
        (err) => {
          console.log('Like update failed');
          console.log(err);
        },
      ),
      PostModel.updateOne({ _id: postId }, { $inc: { likes: 1 } }).catch(
        (err) => {
          console.log('Post like incrementing failed');
          console.log(err);
        },
      ),
    ]);
  } catch (e) {
    console.log(e);
  }
}

export async function unlikePost(
  postId: mongoose.Types.ObjectId,
  userId: string,
) {
  const uObjId = new mongoose.Types.ObjectId(userId);
  try {
    await Promise.all([
      LikerModel.updateOne({ _id: postId }, { $pull: { users: uObjId } }).catch(
        (err) => {
          console.log('Liker update failed');
          console.log(err);
        },
      ),
      LikeModel.updateOne({ _id: uObjId }, { $pull: { posts: postId } }).catch(
        (err) => {
          console.log('Like update failed');
          console.log(err);
        },
      ),
      PostModel.updateOne({ _id: postId }, { $inc: { likes: -1 } }).catch(
        (err) => {
          console.log('Post like incrementing failed');
          console.log(err);
        },
      ),
    ]);
  } catch (e) {
    console.log(e);
  }
}

export async function getUserSummary(
  uHandle: string,
  currUserId: mongoose.Types.ObjectId,
) {
  try {
    const user = (
      await UserModel.aggregate([
        { $match: { handle: uHandle } },
        {
          $addFields: {
            currentUser: currUserId,
          },
        },
        {
          $lookup: {
            from: 'followings',
            localField: 'currentUser',
            foreignField: '_id',
            let: { toFind: { $toObjectId: '$_id' } },
            pipeline: [
              {
                $project: {
                  _id: false,
                  found: {
                    $cond: {
                      if: {
                        $in: ['$$toFind', '$users'],
                      },
                      then: true,
                      else: false,
                    },
                  },
                },
              },
            ],
            as: 'isFollowed',
          },
        },
        { $unwind: '$isFollowed' },
        {
          $project: {
            id: true,
            name: true,
            handle: true,
            pfp: true,
            bio: true,
            followers: true,
            following: true,
            isFollowed: '$isFollowed.found',
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
      bio: user.bio ?? '',
      followers: user.followers,
      following: user.following,
      isFollowed: user.isFollowed,
    } as User;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserData(
  uHandle: string,
  currUserId: mongoose.Types.ObjectId,
) {
  try {
    const res = await UserModel.aggregate([
      { $match: { handle: uHandle } },
      {
        $addFields: {
          currentUser: currUserId,
          objectId: { $toObjectId: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'followings',
          localField: 'currentUser',
          foreignField: '_id',
          let: { toFind: '$objectId' },
          pipeline: [
            {
              $project: {
                _id: false,
                found: {
                  $cond: {
                    if: {
                      $in: ['$$toFind', '$users'],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },
          ],
          as: 'isFollowed',
        },
      },
      {
        $lookup: {
          from: 'followers',
          localField: 'currentUser',
          foreignField: '_id',
          let: {
            toFind: '$objectIf',
          },
          pipeline: [
            {
              $project: {
                _id: false,
                found: {
                  $cond: {
                    if: {
                      $in: ['$$toFind', '$users'],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },
          ],
          as: 'isFollowing',
        },
      },
      {
        $unwind: '$isFollowed',
      },
      {
        $unwind: '$isFollowing',
      },
      {
        $project: {
          id: true,
          name: true,
          handle: true,
          pfp: true,
          bio: true,
          followers: true,
          following: true,
          isFollowed: '$isFollowed.found',
          isFollowing: '$isFollowing.found',
        },
      },
    ]);
    if (res.length === 0) {
      return null;
    }
    const user = res[0];
    return {
      id: user._id.toString(),
      name: user.name,
      handle: user.handle,
      pfp: user.pfp,
      bio: user.bio ?? '',
      followers: user.followers,
      following: user.following,
      isFollowed: user.isFollowed,
      isFollowing: user.isFollowing,
    } as User & { isFollowing: boolean };
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserData(
  currUserId: string,
  pfp: File | null,
  name: string | null,
  bio: string | null,
) {
  try {
    let toChange: { pfp?: string; bio?: string; name?: string } = {};
    if (pfp) {
      const response = await uploadPfp(pfp);
      if (!response) throw new Error('no response');
      toChange.pfp = response.url;
    }
    if (name && name.length > 0) {
      toChange.name = name;
    }
    if (bio !== null) {
      toChange.bio = bio;
    }
    await UserModel.updateOne({ _id: currUserId }, toChange);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
  return 'User data updated';
}

export async function getSuggestedUsers(currUserId: string) {
  const currUObjId = new mongoose.Types.ObjectId(currUserId);
  try {
    const users = await FollowingModel.aggregate([
      {
        $match: {
          _id: currUObjId,
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            followers: '$users',
          },
          pipeline: [
            {
              $addFields: {
                stringIds: {
                  $map: {
                    input: '$$followers',
                    as: 'id',
                    in: {
                      $toString: '$$id',
                    },
                  },
                },
              },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $not: {
                        $in: ['$_id', '$stringIds'],
                      },
                    },
                    {
                      $ne: [currUserId, '$_id'],
                    },
                  ],
                },
              },
            },
          ],
          as: 'users',
        },
      },
      {
        $unwind: {
          path: '$users',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: '$users._id',
          name: '$users.name',
          handle: '$users.handle',
          pfp: '$users.pfp',
          bio: '$users.bio',
          followers: '$users.followers',
          followings: '$users.followings',
        },
      },
      {
        $sort: {
          followers: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: true,
          name: true,
          handle: true,
          pfp: true,
          bio: true,
          followers: true,
          following: true,
        },
      },
    ]);
    return users.map((u) => {
      return {
        id: u._id.toString(),
        name: u.name,
        handle: u.handle,
        pfp: u.pfp ?? undefined,
        bio: u.bio,
        isFollowed: false,
      } as User;
    });
  } catch (e) {
    console.log(e);
    return [] as User[];
  }
}

export async function addHashtags(
  postId: mongoose.Types.ObjectId,
  hashtags: Set<string>,
) {
  try {
    hashtags.forEach(async (hashtag) => {
      await HashtagsModel.findOneAndUpdate(
        { _id: hashtag },
        { $inc: { count: 1 }, $push: { posts: postId } },
        { upsert: true },
      );
    });
  } catch (e) {
    console.log(e);
  }
}

export async function getHashtags(
  uObjId: mongoose.Types.ObjectId,
  hashtag: string,
) {
  try {
    const res = await HashtagsModel.aggregate([
      {
        $match: {
          _id: hashtag,
        },
      },
      {
        $project: {
          posts: true,
          _id: false,
        },
      },
      {
        $lookup: {
          from: 'likes',
          pipeline: [
            {
              $match: {
                _id: uObjId,
              },
            },
          ],
          as: 'likedPosts',
        },
      },
      {
        $unwind: {
          path: '$likedPosts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          likedPosts: '$likedPosts.posts',
        },
      },
      // Check if the post is bookmarked by the User
      {
        $lookup: {
          from: 'bookmarks',
          let: {
            postId: '$_id',
          },
          pipeline: [
            {
              $match: {
                _id: uObjId,
              },
            },
          ],
          as: 'bookmarkedPosts',
        },
      },
      {
        $unwind: {
          path: '$bookmarkedPosts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          bookmarkedPosts: '$bookmarkedPosts.posts',
        },
      },
      {
        $unwind: '$posts',
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'posts',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
              },
            },
            {
              $unwind: '$author',
            },
          ],
          as: 'posts',
        },
      },
      {
        $unwind: '$posts',
      },
      {
        $project: {
          _id: '$posts._id',
          content: '$posts.content',
          author: '$posts.author',
          createdAt: '$posts.createdAt',
          updatedAt: '$posts.updatedAt',
          hasLiked: {
            $cond: {
              if: {
                $in: ['$posts._id', '$likedPosts'],
              },
              then: true,
              else: false,
            },
          },
          hasBookmarked: {
            $cond: {
              if: {
                $in: ['$posts._id', '$bookmarkedPosts'],
              },
              then: true,
              else: false,
            },
          },
          likes: '$posts.likes',
          comments: '$posts.comments',
          reposts: '$posts.reposts',
        },
      },
    ]);
    return res.map((p) => {
      return {
        id: p._id.toString(),
        authorName: p.author.name,
        authorHandle: p.author.handle,
        comments: p.comments,
        content: p.content,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        hasBookmarked: p.hasBookmarked,
        hasLiked: p.hasLiked,
        likes: p.likes,
        pfp: p.author.pfp,
        reposts: p.reposts,
      } as Ripple;
    });
  } catch (e) {
    console.log(e);
    return [] as Ripple[];
  }
}

export async function getUserResults(
  currUObjId: mongoose.Types.ObjectId,
  searchQ: string,
) {
  try {
    const res = await FollowingModel.aggregate([
      {
        $match: {
          _id: currUObjId,
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            followedUsers: '$users',
          },
          pipeline: [
            {
              $match: {
                handle: searchQ,
              },
            },
          ],
          as: 'searchedUsers',
        },
      },
      {
        $unwind: '$searchedUsers',
      },
      {
        $project: {
          _id: '$searchedUsers._id',
          handle: '$searchedUsers.handle',
          name: '$searchedUsers.name',
          pfp: '$searchedUsers.pfp',
          bio: '$searchedUsers.bio',
          followers: '$searchedUsers.followers',
          following: '$searchedUsers.following',
          isFollowing: {
            $cond: {
              if: {
                $in: ['$searchedUsers._id', '$users'],
              },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);
    return res.map((u) => {
      return {
        id: u._id.toString(),
        handle: u.handle,
        name: u.name,
        pfp: u.pfp,
        bio: u.bio ?? '',
        followers: u.followers,
        following: u.following,
        isFollowed: u.isFollowed,
      } as User;
    });
  } catch (e) {
    console.log(e);
    return [] as User[];
  }
}

export async function getTrending() {
  try {
    const topTrending: InferredHashtag[] = await HashtagsModel.aggregate([
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $match: { count: { $ne: 0 } },
      },
    ]);
    return topTrending.map((t) => {
      return {
        name: t._id,
        count: t.count,
      };
    });
  } catch (e) {
    console.log(e);
  }
}

export const getAdapter = async () => {
  if (!mongoose.connection) {
    await initDb();
  }
  return new MongodbAdapter(
    // @ts-ignore
    mongoose.connection.collection('sessions'),
    mongoose.connection.collection('users'),
  );
};

// clear database and populate with sample data
export const dbReset = async () => {
  try {
    await Promise.all([
      UserModel.deleteMany({}),
      HashtagsModel.deleteMany({}),
      PostModel.deleteMany({}),
      BookmarksModel.deleteMany({}),
      HashtagsModel.deleteMany({}),
      LikeModel.deleteMany({}),
      LikerModel.deleteMany({}),
      FollowerModel.deleteMany({}),
      FollowingModel.deleteMany({}),
    ]);

    // Create ObjIds
    const jimObjId = new mongoose.Types.ObjectId();
    const michaelObjId = new mongoose.Types.ObjectId();
    const dwightObjId = new mongoose.Types.ObjectId();
    const andrewObjId = new mongoose.Types.ObjectId();
    const guestObjId = new mongoose.Types.ObjectId('66b1042890e68e59d2199cad');

    // Create & add Guest with id 66b1042890e68e59d2199cad,
    const guest: InferredUser = {
      _id: '66b1042890e68e59d2199cad',
      name: 'Guest',
      handle: 'guest',
      password: '$2a$10$l9375VWZO/Oc.Gwri0g23eOHMT8x.gZQxZ1Xs5miJ0QP97yyHb8qO',
      followers: 0,
      following: 0,
    };
    // Create & add Michael, Dwight, Andy and Jim
    const michael: InferredUser = {
      _id: michaelObjId.toString(),
      name: 'Michael Scott',
      handle: 'itsbritneybitch',
      password: '$2a$10$ktfIrm1BcSsTEXox/U43BOLTzVPewIhTcTPl0fCTuJVvSZVRId./u',
      pfp: 'http://res.cloudinary.com/djdafssz0/image/upload/v1717780686/itsbritneybitch.webp',
      bio: "World's best boss\nStar of Threat Level: Midnight",
      followers: 0,
      following: 0,
    };
    const dwight: InferredUser = {
      _id: dwightObjId.toString(),
      name: 'Dwight Schrute',
      handle: 'captainkirk',
      password: '$2a$10$xzO4LpsCpipPfUJ0JLNW8.KDPKEtMtL2ykOxpAYIlqPHc2koknsb2',
      pfp: 'http://res.cloudinary.com/djdafssz0/image/upload/v1722095058/captainkirk.webp',
      bio: 'Assistant Regional Manager at Dunder Mifflin.\nOwner of Schrute Farms.\nVolunteer sheriff deputy.',
      followers: 0,
      following: 0,
    };
    const andrew: InferredUser = {
      _id: andrewObjId.toString(),
      name: 'Andy Bernard',
      handle: 'TheNardDog',
      password: '$2a$10$6o0.bsWtlCgrswbG101ka.RBG8MjyAGZt3o0ANvlyrT/CQDWcqR5G',
      pfp: 'http://res.cloudinary.com/djdafssz0/image/upload/v1723302373/TheNardDog.webp',
      bio: 'Cornell Admissions Director\n🎶 #HereComesTreble',
      followers: 0,
      following: 0,
    };
    const jim: InferredUser = {
      _id: jimObjId.toString(),
      name: 'Dwight Schrute',
      handle: 'jimhalpert',
      password: '$2a$10$NfyD3/3ffIuxcjYlseguiO6HR8dW6G8Q4rHnYKTi7dG4PLbM2CpTe',
      pfp: 'http://res.cloudinary.com/djdafssz0/image/upload/v1723304141/jimhalpert.webp',
      bio: 'Assistant TO THE Regional Manager\nBears. Beets. Battlestar Galactica.',
      followers: 0,
      following: 0,
    };
    await UserModel.insertMany([guest, michael, dwight, andrew, jim]);
    await Promise.all([
      BookmarksModel.insertMany([
        { _id: guestObjId, posts: [] },
        { _id: michaelObjId, posts: [] },
        { _id: dwightObjId, posts: [] },
        { _id: andrewObjId, posts: [] },
        { _id: jimObjId, posts: [] },
      ] as InferredBookmark[]),
      FollowerModel.insertMany([
        { _id: guestObjId, users: [] },
        { _id: michaelObjId, users: [] },
        { _id: dwightObjId, users: [] },
        { _id: andrewObjId, users: [] },
        { _id: jimObjId, users: [] },
      ] as InferredFollower[]),
      FollowingModel.insertMany([
        { _id: guestObjId, users: [] },
        { _id: michaelObjId, users: [] },
        { _id: dwightObjId, users: [] },
        { _id: andrewObjId, users: [] },
        { _id: jimObjId, users: [] },
      ] as InferredFollowing[]),
      LikeModel.insertMany([
        { _id: guestObjId, posts: [] },
        { _id: michaelObjId, posts: [] },
        { _id: dwightObjId, posts: [] },
        { _id: andrewObjId, posts: [] },
        { _id: jimObjId, posts: [] },
      ] as InferredLike[]),
    ]);

    // Have Michael and Jim post
    const michaelPostId = new mongoose.Types.ObjectId();
    const jimPostId = new mongoose.Types.ObjectId();
    await Promise.all([
      addPost(michaelPostId, { content: '#PARKOUR!', author: michael._id }),
      addPost(jimPostId, {
        content: 'Question: What kind of bear is best?',
        author: jim._id,
      }),
    ]);

    // Andy and Dwight comment
    const parkourCommentIds = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
    ];
    const dwightCommentId = new mongoose.Types.ObjectId();
    await Promise.all([
      addComment(parkourCommentIds[0], {
        content: 'PARKOUR!',
        author: dwight._id,
        parent: michaelPostId,
      }),
      addComment(parkourCommentIds[1], {
        content: 'PARKOUR!',
        author: andrew._id,
        parent: michaelPostId,
      }),
      addComment(dwightCommentId, {
        content: 'IDENTITY THEFT IS NOT A JOKE, JIM!',
        author: dwight._id,
        parent: jimPostId,
      }),
    ]);

    // Michael likes each of the comments
    await Promise.all([
      likePost(michaelPostId, michael._id),
      likePost(michaelPostId, andrew._id),
      likePost(michaelPostId, dwight._id),

      likePost(parkourCommentIds[0], michael._id),
      likePost(parkourCommentIds[0], andrew._id),
      likePost(parkourCommentIds[1], michael._id),
      likePost(parkourCommentIds[1], dwight._id),
    ]);

    // Michael follows Jim, Dwight and Adrew follow Michael, Jim follows Dwight, Dwight follows Andy
    await Promise.all([
      addFollow(michaelObjId, jimObjId),
      addFollow(dwightObjId, michaelObjId),
      addFollow(andrewObjId, michaelObjId),
      addFollow(jimObjId, dwightObjId),
      addFollow(dwightObjId, andrewObjId),
    ]);

    await addBookmark(jimObjId, dwightCommentId);
  } catch (e) {
    console.log(e);
  }
};
