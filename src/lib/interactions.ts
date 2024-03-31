import { getCurrentUser } from "./server";
import {
  addPost,
  addComment,
  likePost,
  getLike,
  unlikePost,
  getFeed as getPosts,
  getPost as getOnePost,
  getBookmarks as getBm,
  addBookmark as addBm,
  removeBookmark as remBm,
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
  const alreadyLiked = await getLike(postId, id);
  if (!alreadyLiked) {
    await likePost(postId, id);
  }
};

export const unlike = async (post: string) => {
  const id = (await getCurrentUser()).id;
  const postId = new mongoose.Types.ObjectId(post);
  const alreadyLiked = await getLike(postId, id);
  if (alreadyLiked) {
    await unlikePost(postId, id);
  }
};

export const getFeed = async () => {
  const id = (await getCurrentUser()).id;
  return await getPosts(id);
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
