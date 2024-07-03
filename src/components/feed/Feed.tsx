import Ripple from "./Ripple";
import { type Ripple as RippleType } from "~/types";
import { createResource, For } from "solid-js";

export default function Feed(props: {
  fetcher: () => Promise<RippleType[] | undefined>;
}) {
  const [posts] = createResource(
    () => props.fetcher,
    async (f) => {
      return (await f()) as RippleType[];
    }
  );

  return (
    <div class="">
      <For
        each={posts()}
        fallback={<div class="text-center text-xl mt-6">No posts found</div>}
      >
        {(item) => {
          return <Ripple post={item} />;
        }}
      </For>
    </div>
  );
}
