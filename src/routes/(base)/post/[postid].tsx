import { useParams, A } from "@solidjs/router";
import Sidebar from "~/components/sidebar/Sidebar";
import { getPost } from "~/lib/server";
import { createMemo, createResource, createSignal, For, Show } from "solid-js";
import Ripple from "~/components/feed/Ripple";
import MainRipple from "~/components/feed/MainRipple";
import { Suspense } from "solid-js";
import { createEffect } from "solid-js";

const defaultPost = {
  id: "idasd",
  pfp: "",
  authorName: "default",
  authorHandle: "def",
  createdAt: new Date(),
  updatedAt: new Date(),
  content: "Default",
  likes: 0,
  hasLiked: false,
  reposts: 0,
  comments: 0,
};

export default function Post() {
  const params = useParams();
  const [post] = createResource(
    () => params.postid,
    (postid) => {
      return getPost(postid);
    }
  );

  return (
    <main class="w-[990px] flex justify-start h-full relative">
      <div class="shrink w-[600px] h-full relative">
        <nav class="flex w-full sticky top-0 border-b border-ui">
          <div class="px-4 w-1/2 bg-background gap-3 h-[53px] font-semibold grow flex items-center ">
            <A
              href="/home"
              class=" w-8 aspect-square p-1 rounded-full hover:bg-ui "
            >
              {"<-"}
            </A>
            <div class="flex items-center h-[52px] ">Post</div>
          </div>
        </nav>
        <Suspense fallback={<div>Loading...</div>}>
          <MainRipple post={post()} />
          <For each={post() ? post()!.children : []}>
            {(item) => {
              return (
                <A href={`/post/${item.id}`}>
                  <Ripple post={item} />
                </A>
              );
            }}
          </For>
        </Suspense>
      </div>
      <div class="shrink w-[350px] mr-[10px]">
        <Sidebar />
      </div>
    </main>
  );
}
