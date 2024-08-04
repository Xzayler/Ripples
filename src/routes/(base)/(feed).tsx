import { A } from '@solidjs/router';
import QuickPost from '~/components/feed/QuickPost';
import type { JSX } from 'solid-js';

export default function FeedPage(props: { children: JSX.Element }) {
  return (
    <div class="relative flex flex-col self-stretch w-full h-full">
      <nav class="z-10 pl-14 @[31.25rem]/content:pl-0 bg-background flex w-full sticky top-0 border-b border-ui">
        <A
          activeClass="underline decoration-accent decoration-4 underline-offset-8"
          href="/home"
          class=" px-4 w-1/2 bg-background hover:bg-highlight h-[53px] font-semibold grow flex items-center justify-center"
        >
          <div class="flex items-center justify-center min-w-[56px] h-[52px] ">
            For you
          </div>
        </A>
        <A
          activeClass="underline decoration-accent decoration-4 underline-offset-8"
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
      {props.children}
    </div>
  );
}
