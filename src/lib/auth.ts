import { Lucia } from "lucia";
import { redirect, action, cache } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { createUser, getAdapter, getUserByUsername } from "./database";
import { setCookie } from "vinxi/http";
import { Argon2id } from "oslo/password";

export const lucia = new Lucia(getAdapter()!, {
  sessionCookie: {
    expires: true,
    attributes: {
      // set to `true` when using HTTPS
      // secure: process.env.NODE_ENV === "production",
      secure: false,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      handle: attributes.handle,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export interface DatabaseUserAttributes {
  name: string;
  handle: string;
}

export const register = action(async (formData: FormData) => {
  "use server";
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return new Error("Invalid username");
  }

  const name = formData.get("name");
  if (
    typeof name !== "string" ||
    name.length < 3 ||
    name.length > 31 ||
    !/^[a-zA-Z0-9_-\s]+$/.test(name)
  ) {
    return new Error("Invalid name");
  }

  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return new Error("Invalid password");
  }

  if (password !== confirmPassword) {
    return new Error("Passwords do not match");
  }

  const hashedPass = await new Argon2id().hash(password);
  try {
    await createUser({ name: name, handle: username, password: hashedPass });
  } catch (error) {
    return error as Error;
  }
  return redirect("/login");
});

export const login = action(async (formData: FormData) => {
  "use server";
  const username = String(formData.get("username"));
  if (
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return new Error("Invalid username");
  }

  const password = String(formData.get("password"));
  if (password.length < 6 || password.length > 255) {
    return new Error("Invalid password");
  }

  const existingUser = await getUserByUsername(username);
  if (!existingUser) {
    return new Error("That user doesn't exist");
  }

  const validPassword = await new Argon2id().verify(
    existingUser.password,
    password
  );
  if (!validPassword) {
    return new Error("Incorrect username or password");
  }

  const session = await lucia.createSession(existingUser._id, {});
  const event = getRequestEvent()!;

  const sessCookieVal = lucia.createSessionCookie(session.id).serialize();
  setCookie(event.nativeEvent, lucia.sessionCookieName, sessCookieVal);
  return redirect("/home");
});

export const logout = action(async (formData: FormData) => {
  "use server";
  const event = getRequestEvent();
  if (!event?.nativeEvent.context.session) {
    return new Error("Unauthorized");
  }

  await lucia.invalidateSession(event.nativeEvent.context.session.id);
  setCookie(
    event.nativeEvent,
    lucia.sessionCookieName,
    lucia.createBlankSessionCookie().serialize()
  );

  return redirect("/login");
});

export const getCurrentUser = cache(async () => {
  "use server";
  const event = getRequestEvent();
  if (!event?.nativeEvent.context.session || !event?.nativeEvent.context.user) {
    throw redirect("/login");
  }
  return event.nativeEvent.context.user;
}, "user");
