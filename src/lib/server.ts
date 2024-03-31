"use server";
import { cache } from "@solidjs/router";
import { register as rg, login as li, logout as lo } from "./auth";
import { getRequestEvent } from "solid-js/web";
import { redirect } from "@solidjs/router";
import { User } from "lucia";
import {
  submitPost as sp,
  submitComment as sc,
  like as lp,
  unlike as ulp,
  getFeed as gf,
  getPost as gp,
  getBookmarks as gb,
  addBookmark as ab,
  removeBookmark as rb,
} from "./interactions";

// session / auth
export const register = rg;
export const login = li;
export const logout = lo;

export const getCurrentUser = cache((): User => {
  const event = getRequestEvent();
  if (!event || !event.locals.session || !event.locals.user) {
    throw redirect("/login");
  }
  return event.locals.user;
}, "curruser");

// Interactions
export const submitPost = sp;
export const submitComment = sc;
export const getFeed = gf;
export const likePost = lp;
export const unlikePost = ulp;

// Data
export const getPost = gp;
export const addBookmark = ab;
export const getBookmarks = gb;
export const removeBookmark = rb;
