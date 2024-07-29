'use server';
import { register as rg, login as li, logout as lo } from './auth';
import {
  submitPost as sp,
  submitComment as sc,
  like as lp,
  unlike as ulp,
  getFeed as gf,
  getSubFeed as gsf,
  getUserPosts as gup,
  getUserLikedPosts as gulp,
  getPost as gp,
  getBookmarks as gb,
  addBookmark as ab,
  removeBookmark as rb,
  getUserSummary as gus,
  getUserData as gud,
  addFollow as af,
  removeFollow as rf,
  updateUserData as uud,
  getSuggestedUsers as gsu,
  getTrending as gt,
  getHashtags as gh,
  getUserResults as gur,
} from './interactions';

// session / auth
export const register = rg;
export const login = li;
export const logout = lo;

// Interactions
export const submitPost = sp;
export const submitComment = sc;
export const likePost = lp;
export const unlikePost = ulp;
export const addBookmark = ab;
export const removeBookmark = rb;
export const addFollow = af;
export const removeFollow = rf;
export const updateUserData = uud;

// Data
export const getFeed = gf;
export const getSubFeed = gsf;
export const getUserPosts = gup;
export const getUserLikedPosts = gulp;
export const getPost = gp;
export const getBookmarks = gb;
export const getUserSummary = gus;
export const getUserData = gud;
export const getSuggestedUsers = gsu;
export const getTrending = gt;
export const getHashtags = gh;
export const getUserResults = gur;
