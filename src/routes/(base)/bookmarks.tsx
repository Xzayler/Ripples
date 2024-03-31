import { useContext, Suspense, createResource, For } from "solid-js";
import Sidebar from "~/components/sidebar/Sidebar";
import { UserContext } from "~/lib/UserContext";
import type { Ripple as RippleType } from "~/types";
import Ripple from "~/components/feed/Ripple";
import { getBookmarks } from "~/lib/server";
import { A } from "@solidjs/router";

function BookmarkedPosts() {
  const [bookmarks] = createResource(async () => {
    return (await getBookmarks()) as RippleType[];
  });
  return (
    <For each={bookmarks() ? bookmarks() : []}>
      {(item) => {
        return (
          <A href={`/post/${item.id}`}>
            <Ripple post={item} />
          </A>
        );
      }}
    </For>
  );
}

export default function Bookmarks() {
  const user = useContext(UserContext);
  return (
    <main class="w-[990px] flex justify-between h-full relative items-end ">
      <div class="shrink w-[600px] relative flex flex-col self-stretch ">
        <div class="flex flex-col justify-center items-start w-full sticky top-0 h-[53px] px-4">
          <h1 class="text-xl font-bold">Bookmarks</h1>
          <p class="text-sm leading-4 text-faint ">{`@${
            user!() ? user!()!.handle : "loading"
          }`}</p>
        </div>
        <Suspense>
          <BookmarkedPosts />
        </Suspense>
      </div>
      {/* Sidebar */}
      <div class="shrink w-[350px] mr-[10px] border-l border-ui p">
        <Sidebar />
      </div>
    </main>
  );
}
