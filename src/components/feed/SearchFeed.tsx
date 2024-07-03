import Ripple from "./Ripple";
import { type Ripple as RippleType } from "~/types";
import { createResource, For } from "solid-js";
import { useSearchParams } from "@solidjs/router";

type SearchParams = {
  searchType: "general" | "hashtag" | "user";
  q: string;
};

export default function SearchFeed(props: {
  fetcher: (a: string) => Promise<RippleType[] | undefined>;
}) {
  const [posts] = createResource(
    useSearchParams<SearchParams>,
    async (params) => {
      return (await props.fetcher(params[0].q ?? "")) as RippleType[];
    }
  );

  return (
    <div class="">
      <For each={posts()}>
        {(item) => {
          return <Ripple post={item} />;
        }}
      </For>
    </div>
  );
}
