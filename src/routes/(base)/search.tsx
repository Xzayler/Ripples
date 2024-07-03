import {
  Suspense,
  createSignal,
  Switch,
  Match,
  Show,
  createEffect,
} from "solid-js";
import BackButton from "~/components/shared/BackButton";
import Feed from "~/components/feed/Feed";
import SearchFeed from "~/components/feed/SearchFeed";
import Sidebar from "~/components/sidebar/Sidebar";
import { useSearchParams } from "@solidjs/router";
import { createResource } from "solid-js";

import { getHashtags } from "~/lib/server";
import { Ripple } from "~/types";

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
          <Feed fetcher={fetcher()} />
        </Suspense>
      </div>
      {/* Sidebar */}
      <div class="shrink w-[350px] mr-[10px] border-l border-ui p">
        <Sidebar />
      </div>
    </main>
  );
}
