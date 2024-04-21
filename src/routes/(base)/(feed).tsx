import { A } from "@solidjs/router";
import QuickPost from "~/components/feed/QuickPost";
import Sidebar from "~/components/sidebar/Sidebar";
import { Suspense } from "solid-js";
import type { JSX } from "solid-js";

export default function FeedPage(props: { children: JSX.Element }) {
  return (
    <main class="w-[990px] flex justify-between h-full relative items-end ">
      <div class="shrink w-[600px] relative flex flex-col self-stretch ">
        <nav class="flex w-full sticky top-0 border-b border-ui">
          <A
            activeClass="underline decoration-accent decoration-8 underline-offset-8"
            href="/home"
            class="px-4 w-1/2 bg-background hover:bg-highlight h-[53px] font-semibold grow flex items-center justify-center"
          >
            <div class="flex items-center justify-center min-w-[56px] h-[52px] ">
              For you
            </div>
          </A>
          <A
            activeClass="underline decoration-accent decoration-8 underline-offset-8"
            href="/follows"
            class="px-4 w-1/2 bg-background hover:bg-highlight h-[53px] font-semibold grow flex items-center justify-center"
          >
            <div class="flex items-center justify-center min-w-[56px] h-[52px] ">
              Following
            </div>
          </A>
        </nav>
        <div class="border-solid border-b border-ui">
          <QuickPost />
        </div>
        <Suspense>{props.children}</Suspense>
      </div>
      {/* Sidebar */}
      <div class="shrink w-[350px] mr-[10px] border-l border-ui p">
        <Sidebar />
      </div>
    </main>
  );
}
