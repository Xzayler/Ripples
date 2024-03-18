"use server";
import { cache } from "@solidjs/router";
import { register as rg, login as li, logout as lo } from "./auth";

export const register = rg;
export const login = li;
export const logout = lo;
