import { useParams } from "@solidjs/router";
import Sidebar from "~/components/sidebar/Sidebar";
import { getPost } from "~/lib/server";
import { createResource, For } from "solid-js";
import Ripple from "~/components/feed/Ripple";
import MainRipple from "~/components/feed/MainRipple";
import { Suspense } from "solid-js";
import BackButton from "~/components/shared/BackButton";

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
            <BackButton />
            <div class="flex items-center h-[52px] ">Post</div>
          </div>
        </nav>
        <Suspense fallback={<div>Loading...</div>}>
          <MainRipple post={post()} />
          <For each={post() ? post()!.children : []}>
            {(item) => {
              return <Ripple post={item} />;
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
