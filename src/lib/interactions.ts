import { getCurrentUser } from "./server";
import {
  addPost,
  addComment,
  likePost,
  getLike,
  unlikePost,
  getFeed as getPosts,
  getPost as getOnePost,
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
