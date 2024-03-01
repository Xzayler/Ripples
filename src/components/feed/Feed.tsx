import Ripple from "./Ripple";

import { createResource, For } from "solid-js";
import { getPosts } from "~/lib/database";
import type { Post } from "~/models/PostModel";
import { createAsync } from "@solidjs/router";

export default function Feed() {
  const [posts] = createResource(async () => {
    "use server";
    return (await getPosts({})) as Post[];
  });

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
