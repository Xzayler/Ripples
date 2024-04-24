import Feed from "~/components/feed/Feed";
import { getBookmarks } from "~/lib/server";
import { A } from "@solidjs/router";
import { Suspense } from "solid-js";
import Sidebar from "~/components/sidebar/Sidebar";

export default function Bookmarks() {
  return (
    <main class="w-[990px] flex justify-between h-full relative items-end ">
      <div class="shrink w-[600px] relative flex flex-col self-stretch ">
        <nav class="flex w-full sticky top-0 border-b border-ui z-50">
          <div class="px-4 w-1/2 bg-background gap-3 h-[53px] font-semibold grow flex items-center ">
            <A
              href="/home"
              class=" w-8 aspect-square p-1 rounded-full hover:bg-ui "
            >
              {"<-"}
            </A>
            <h1 class="flex items-center h-[52px] ">My Bookmarks</h1>
          </div>
        </nav>
        <Suspense>
          <Feed fetcher={getBookmarks} />
        </Suspense>
      </div>
      {/* Sidebar */}
      <div class="shrink w-[350px] mr-[10px] border-l border-ui p">
        <Sidebar />
      </div>
    </main>
  );
}
