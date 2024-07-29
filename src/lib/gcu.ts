import { cache, redirect } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import type { User } from '~/types';
import { getCurrentUser as gcu } from './database';

export const getCurrentUser = cache(
  async (): Promise<
    Omit<User, 'isFollowed' | 'followers' | 'following' | 'bio'>
  > => {
    'use server';
    const event = await getRequestEvent();
    if (!event || !event.locals.session || !event.locals.user) {
      return redirect('/login');
    }
    return await gcu(event.locals.user.id);
  },
  'curruser',
);
