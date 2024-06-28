import { cache, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import type { User } from "lucia";

export const getCurrentUser = cache(async (): Promise<User> => {
  "use server";
  const event = await getRequestEvent();
  if (!event || !event.locals.session || !event.locals.user) {
    return redirect("/login");
  }
  return event.locals.user;
}, "curruser");
