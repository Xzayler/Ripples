import {
  Suspense,
  createSignal,
  Switch,
  Match,
  For,
  Show,
  createEffect,
  createResource,
} from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import BackButton from '~/components/shared/BackButton';
import Feed from '~/components/feed/Feed';
import UserPfp from '~/components/user/UserPfp';
import UserWrapper from '~/components/user/UserWrapper';
import FollowButton from '~/components/user/FollowButton';
import MultiLineText from '~/components/shared/MultiLineText';

import { getHashtags, getUserResults } from '~/lib/server';
import { Ripple, User } from '~/types';
import SearchBar from '~/components/sidebar/SearchBar';
import Sidebar from '~/components/sidebar/Sidebar';

type SearchParams = {
  searchType: 'general' | 'hashtag' | 'user';
  q: string;
};

export default function Search() {
  const [searchParams] = useSearchParams<SearchParams>();
  const [fetcher, setFetcher] = createSignal(
    () => new Promise<Ripple[]>((resolve) => resolve([] as Ripple[])),
  );

  createEffect(() => {
    const q = searchParams.q;
    switch (searchParams.searchType) {
      case 'hashtag':
        setFetcher(() => {
          return () => getHashtags(q ?? '');
        });
        break;

      default:
        setFetcher(() => {
          return () =>
            new Promise<Ripple[]>((resolve) => resolve([] as Ripple[]));
        });
        break;
    }
  });

  return (
    <div class="relative flex flex-col self-stretch h-full">
      <nav class="z-10 pl-8 @[31.25rem]/content:pl-0 bg-background flex w-full sticky top-0 border-b border-ui">
        <div class="px-4 w-1/2 bg-background gap-3 h-[53px] font-semibold grow flex items-center ">
          <BackButton />
          <h1 class="flex items-center h-[52px] ">
            {Object.keys(searchParams).length === 0
              ? 'Search'
              : 'Search Results'}
          </h1>
        </div>
      </nav>
      <Show
        when={Object.keys(searchParams).length === 0}
        fallback={
          <div class="w-full bg-background border-b border-ui px-1 py-3 text-lg text-center">{`Searched for: ${
            searchParams.searchType === 'hashtag' ? '#' : ''
          }${searchParams.searchType === 'user' ? '@' : ''}${
            searchParams.q
          }`}</div>
        }
      >
        <div class="px-4 text-center @[62rem]/content:hidden text-xl ">
          <Sidebar />
        </div>
      </Show>
      <Suspense>
        <Switch>
          <Match when={searchParams.searchType == 'user'}>
            <UserFeed q={searchParams.q ?? ''} />
          </Match>
          <Match when={searchParams.searchType == 'hashtag'}>
            <Feed fetcher={fetcher()} />
          </Match>
        </Switch>
      </Suspense>
    </div>
  );
}

function UserFeed(props: { q: string }) {
  const [users] = createResource(
    () => props.q,
    async (q) => {
      return await getUserResults(q);
    },
  );
  return (
    <For
      each={users()}
      fallback={<div class="text-center text-xl mt-6">No users found</div>}
    >
      {(item) => {
        return <UserEntry user={item} />;
      }}
    </For>
  );
}

function UserEntry(props: { user: User }) {
  return (
    <div class="border-b border-ui p-2 ">
      <div class="flex gap-1 items-start">
        <div class="w-14 aspect-square ">
          <UserPfp pfp={props.user.pfp} />
        </div>
        <div class="grow">
          <div class="flex items-start">
            <div>
              <div class="mr-1">
                <UserWrapper handle={props.user.handle}>
                  <span class="font-bold text-foreground">
                    {props.user.name}
                  </span>
                </UserWrapper>
              </div>
              <div class="flex text-faint">
                <UserWrapper handle={props.user.handle}>
                  <span>{`@${props.user.handle}`}</span>
                </UserWrapper>
              </div>
            </div>
            <div class="grow flex justify-end">
              <FollowButton
                isFollowed={props.user.isFollowed}
                uId={props.user.id}
              />
            </div>
          </div>
          {props.user.bio != '' ? (
            <p>
              <MultiLineText text={props.user.bio} />
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
