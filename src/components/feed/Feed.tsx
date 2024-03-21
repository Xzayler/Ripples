import Ripple from "./Ripple";

import { createResource, For } from "solid-js";
import { getFeed } from "~/lib/server";

export default function Feed() {
  const [posts] = createResource(async () => {
    return (await getFeed()) as Ripple[];
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
