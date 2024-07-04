import {
  Suspense,
  createSignal,
  Switch,
  Match,
  For,
  createEffect,
  createResource,
} from "solid-js";
import { useSearchParams } from "@solidjs/router";
import BackButton from "~/components/shared/BackButton";
import Feed from "~/components/feed/Feed";
import Sidebar from "~/components/sidebar/Sidebar";
import UserPfp from "~/components/user/UserPfp";
import UserWrapper from "~/components/user/UserWrapper";
import MultiLineText from "~/components/shared/MultiLineText";

import { getHashtags, getUserResults } from "~/lib/server";
import { Ripple, User } from "~/types";

type SearchParams = {
  searchType: "general" | "hashtag" | "user";
  q: string;
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams<SearchParams>();
  const [fetcher, setFetcher] = createSignal(
    () => new Promise<Ripple[]>((resolve) => resolve([] as Ripple[]))
  );

  createEffect(() => {
    const q = searchParams.q;
    switch (searchParams.searchType) {
      case "hashtag":
        setFetcher(() => {
          return () => getHashtags(q ?? "");
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
    <main class="w-[990px] flex justify-between h-full relative items-end ">
      <div class="shrink w-[600px] relative flex flex-col self-stretch ">
        <nav class="flex w-full sticky top-0 border-b border-ui z-50">
          <div class="px-4 w-1/2 bg-background gap-3 h-[53px] font-semibold grow flex items-center ">
            <BackButton />
            <h1 class="flex items-center h-[52px] ">Search Results</h1>
          </div>
        </nav>
        <Suspense>
          <Switch>
            <Match when={searchParams.searchType == "user"}>
              <UserFeed q={searchParams.q ?? ""} />
            </Match>
            <Match when={searchParams.searchType == "hashtag"}>
              <Feed fetcher={fetcher()} />
            </Match>
          </Switch>
        </Suspense>
      </div>
      {/* Sidebar */}
      <div class="shrink w-[350px] mr-[10px] border-l border-ui p">
        <Sidebar />
      </div>
    </main>
  );
}

function UserFeed(props: { q: string }) {
  const [users] = createResource(
    () => props.q,
    async (q) => {
      return await getUserResults(q);
    }
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
      <div class="flex items-start gap-1">
        <div class="w-14 aspect-square ">
          <UserPfp pfp={props.user.pfp} />
        </div>
        <div class="">
          <div class="mr-1">
            <UserWrapper handle={props.user.handle}>
              <span class="font-bold text-foreground">{props.user.name}</span>
            </UserWrapper>
          </div>
          <div class="flex text-faint">
            <UserWrapper handle={props.user.handle}>
              <span>{`@${props.user.handle}`}</span>
            </UserWrapper>
          </div>
          {props.user.bio != "" ? <p>{props.user.bio}</p> : null}
        </div>
      </div>
    </div>
  );
}
