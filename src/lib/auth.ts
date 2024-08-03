import { Lucia } from 'lucia';
import { redirect } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import { createUser, getAdapter, getUserByUsername } from './database';
import { setCookie } from 'vinxi/http';
import bcrypt from 'bcryptjs';

export const getLucia = async () => {
  return new Lucia((await getAdapter())!, {
    sessionCookie: {
      expires: true,
      attributes: {
        // set to `true` when using HTTPS
        // secure: false,
        secure: process.env.NODE_ENV === 'production',
      },
    },
    getUserAttributes: (attributes) => {
      return {
        _id: attributes._id,
      };
    },
  });
};

declare module 'lucia' {
  interface Register {
    Lucia: Lucia<
      Record<never, never>,
      {
        _id: string;
      }
    >;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export interface DatabaseUserAttributes {
  _id: string;
}

export const register = async (formData: FormData) => {
  const username = formData.get('username');
  if (
    typeof username !== 'string' ||
    username.length < 3 ||
    username.length > 31
  ) {
    return new Error('Invalid username');
  }
  if (!/^[a-z0-9_-]+$/.test(username))
    return new Error(
      "Username must only contain 0-9, a-z, '_' and '-' characters",
    );
  const name = formData.get('name');
  if (
    typeof name !== 'string' ||
    name.length < 3 ||
    name.length > 31 ||
    !/^[a-zA-Z0-9_-\s]+$/.test(name)
  ) {
    return new Error('Invalid name');
  }
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    return new Error('Invalid password');
  }
  if (password !== confirmPassword) {
    return new Error('Passwords do not match');
  }
  const hashedPass = await bcrypt.hash(password, 10);

  try {
    await createUser(name, username, hashedPass);
  } catch (error) {
    return error as Error;
  }
  return redirect('/login');
};

export const login = async (formData: FormData) => {
  const username = String(formData.get('username'));
  if (
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return new Error('Invalid username');
  }

  const password = String(formData.get('password'));
  if (password.length < 6 || password.length > 255) {
    return new Error('Invalid password');
  }

  const existingUser = await getUserByUsername(username);
  if (!existingUser) {
    return new Error("That user doesn't exist");
  }
  const validPassword = bcrypt.compare(password, existingUser.password);
  if (!validPassword) {
    return new Error('Incorrect username or password');
  }

  const lucia = await getLucia();

  const session = await lucia.createSession(existingUser._id, {});
  const event = getRequestEvent()!;

  const sessCookieVal = lucia.createSessionCookie(session.id).serialize();
  setCookie(event.nativeEvent, lucia.sessionCookieName, sessCookieVal);
  // event.request.headers.set(lucia.sessionCookieName, sessCookieVal); not working for some reason.
  return redirect('/home');
};

export const logout = async () => {
  const event = getRequestEvent();
  if (!event?.locals.session) {
    return new Error('Unauthorized');
  }
  const lucia = await getLucia();
  await lucia.invalidateSession(event.locals.session.id);
  event.response.headers.set(
    lucia.sessionCookieName,
    lucia.createBlankSessionCookie().serialize(),
  );

  throw redirect('/login');
};
