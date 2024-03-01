import { A } from "@solidjs/router";
import { createResource } from "solid-js";
import { getCurrentUser } from "~/lib/auth";

import QuickPost from "~/components/feed/QuickPost";
import Feed from "~/components/feed/Feed";
import Sidebar from "~/components/sidebar/Sidebar";

export default function Home() {
  const [user] = createResource(async () => {
    "use server";
    return await getCurrentUser();
  });

  return (
    <main class="w-[990px] flex justify-between h-full relative">
      <div class="shrink w-[600px] h-full border-x border-ui relative">
        <nav class="flex w-full sticky top-0 border-b border-b-ui">
          <A
            href=""
            class="px-4 w-1/2 bg-background hover:bg-highlight h-[53px] font-semibold grow flex items-center justify-center"
          >
            <div class="flex items-center justify-center min-w-[56px] h-[52px] ">
              For you
            </div>
          </A>
          <A
            href=""
            class="px-4 w-1/2 bg-background hover:bg-highlight h-[53px] font-semibold grow flex items-center justify-center"
          >
            <div class="flex items-center justify-center min-w-[56px] h-[52px] ">
              Following
            </div>
          </A>
        </nav>
        <div class="border-ui border-b">
          <QuickPost />
        </div>
        <Feed />
      </div>
      {/* Sidebar */}
      <div class="shrink w-[350px] mr-[10px] border border-t-0">
        <Sidebar />
      </div>
    </main>
  );
}
