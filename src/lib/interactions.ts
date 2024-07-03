import { getCurrentUser } from "./server";
import {
  addPost,
  addComment,
  likePost,
  unlikePost,
  getFeed as getPosts,
  getSubFeed as getSubPosts,
  getUserPosts as getUPosts,
  getUserLikedPosts as getULPosts,
  getPost as getOnePost,
  getBookmarks as getBm,
  addBookmark as addBm,
  removeBookmark as remBm,
  getUserSummary as getUS,
  getUserData as getUD,
  addFollow as addFl,
  removeFollow as remFl,
  updateUserData as uud,
  getSuggestedUsers as gsu,
  getTrending as gt,
  getHashtags as gh,
} from "./database";
import mongoose from "mongoose";

export const submitPost = async (formData: FormData) => {
  const id = (await getCurrentUser()).id;
  const body = formData.get("body")?.toString();
  await addPost({
    content: body ?? "",
    author: id,
  });
};
export const submitComment = async (formData: FormData, postId: string) => {
  const id = (await getCurrentUser()).id;
  const body = formData.get("body")?.toString();
  await addComment({
    content: body ?? "",
    author: id,
    parent: new mongoose.Types.ObjectId(postId),
  });
};

export const like = async (post: string) => {
  const id = (await getCurrentUser()).id;
  const postId = new mongoose.Types.ObjectId(post);
  await likePost(postId, id);
};

export const unlike = async (post: string) => {
  const id = (await getCurrentUser()).id;
  const postId = new mongoose.Types.ObjectId(post);
  await unlikePost(postId, id);
};

export const getFeed = async () => {
  const id = (await getCurrentUser()).id;
  return await getPosts(id);
};

export const getSubFeed = async () => {
  const id = (await getCurrentUser()).id;
  return await getSubPosts(id);
};

export const getUserPosts = async (uId: string) => {
  const currUId = new mongoose.Types.ObjectId((await getCurrentUser()).id);
  return await getUPosts(uId, currUId);
};

export const getUserLikedPosts = async (uId: string) => {
  const currUId = new mongoose.Types.ObjectId((await getCurrentUser()).id);
  return await getULPosts(uId, currUId);
};

export const getPost = async (post: string) => {
  const id = (await getCurrentUser()).id;
  const postId = new mongoose.Types.ObjectId(post);
  return await getOnePost(id, postId);
};

export const addBookmark = async (pId: string) => {
  const bmId = new mongoose.Types.ObjectId((await getCurrentUser()).id);
  const postId = new mongoose.Types.ObjectId(pId);
  return await addBm(bmId, postId);
};

export const removeBookmark = async (pId: string) => {
  const bmId = new mongoose.Types.ObjectId((await getCurrentUser()).id);
  const postId = new mongoose.Types.ObjectId(pId);
  return await remBm(bmId, postId);
};

export const getBookmarks = async () => {
  const id = (await getCurrentUser()).id;
  const bmId = new mongoose.Types.ObjectId(id);
  return await getBm(bmId);
};

export const addFollow = async (uId: string) => {
  const follower = (await getCurrentUser()).id;
  if (follower == uId) return;
  const followerId = new mongoose.Types.ObjectId(follower);
  const followeeId = new mongoose.Types.ObjectId(uId);
  return await addFl(followerId, followeeId);
};

export const removeFollow = async (uId: string) => {
  const followerId = new mongoose.Types.ObjectId((await getCurrentUser()).id);
  const followeeId = new mongoose.Types.ObjectId(uId);
  return await remFl(followerId, followeeId);
};

export const getUserSummary = async (uHandle: string) => {
  const currUId = new mongoose.Types.ObjectId((await getCurrentUser()).id);
  return await getUS(uHandle, currUId);
};

export const getUserData = async (uHandle: string) => {
  const currUId = new mongoose.Types.ObjectId((await getCurrentUser()).id);
  return await getUD(uHandle, currUId);
};

export const updateUserData = async (
  pfp: File | null,
  name: string | null,
  bio: string | null
) => {
  const currUser = await getCurrentUser();
  let newImg: File | null = null;
  if (pfp) {
    newImg = new File([pfp], currUser.handle, {
      type: pfp.type,
    });
  }
  return await uud(currUser.id, newImg, name, bio);
};

export const getSuggestedUsers = async () => {
  const currUserId = (await getCurrentUser()).id;
  return await gsu(currUserId);
};

export const getTrending = gt;

export const getHashtags = async (hashtag: string) => {
  const currUId = new mongoose.Types.ObjectId((await getCurrentUser()).id);
  return await gh(currUId, hashtag);
};
