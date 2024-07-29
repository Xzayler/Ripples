import type { User } from '~/types';
import { createContext } from 'solid-js';
import type { Resource } from 'solid-js';

export const UserContext =
  createContext<
    Resource<Omit<User, 'isFollowed' | 'followers' | 'following' | 'bio'>>
  >();
