import Ripple from "./Ripple";
import { type Ripple as RippleType } from "~/types";
import { createResource, For } from "solid-js";

export default function Feed(props: {
  fetcher: () => Promise<RippleType[] | undefined>;
}) {
  const [posts] = createResource(async () => {
    return (await props.fetcher()) as RippleType[];
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
