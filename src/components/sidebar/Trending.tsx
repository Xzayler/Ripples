import { For } from "solid-js";
import { createResource } from "solid-js";

type Tag = {
  text: string;
  count: number;
};

function TrendEntry(props: { tag: Tag }) {
  return (
    <div class="px-4 py-3 hover:bg-highlightextra ">
      <div class="flex flex-col">
        <div class=" text-faint text-sm  ">1 · Trending</div>
        <div class=" text-foreground text-md font-bold mt-[1px]">{`#${props.tag.text}`}</div>
        <div class="text-faint text-sm mt-1">{`${props.tag.count} posts`}</div>
      </div>
    </div>
  );
}

export default function Trending() {
  const [tags] = createResource(() => {
    return [{ text: "webdev", count: 0 }] as Tag[];
  });
  return (
    <div class="rounded-2xl bg-highlight ">
      <h2 class=" px-4 py-3 text-foreground text-xl font-extrabold ">
        Trending
      </h2>
      <For each={tags()}>
        {(tag) => {
          return <TrendEntry tag={tag} />;
        }}
      </For>
    </div>
  );
}

export function TrendingSkeleton() {
  return (
    <div class="rounded-2xl bg-highlight ">
      <h2 class=" px-4 py-3 text-foreground text-xl font-extrabold ">
        Trending
      </h2>
      <TrendEntrySkeleton />
      <TrendEntrySkeleton />
      <TrendEntrySkeleton />
      <TrendEntrySkeleton />
      <TrendEntrySkeleton />
      <TrendEntrySkeleton />
    </div>
  );
}

function TrendEntrySkeleton() {
  return (
    <div class="px-4 py-3 hover:bg-highlightextra ">
      <div class="flex flex-col">
        <div class=" text-faint text-sm  ">1 · Trending</div>
        <div class=" text-foreground text-md font-bold mt-[1px]">#webdev</div>
        <div class="text-faint text-sm mt-1">12.1K posts</div>
      </div>
    </div>
  );
}
