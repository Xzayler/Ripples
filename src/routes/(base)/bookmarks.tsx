import Feed from '~/components/feed/Feed';
import { getBookmarks } from '~/lib/server';
import { Suspense } from 'solid-js';
import BackButton from '~/components/shared/BackButton';

export default function Bookmarks() {
  return (
    <div class="relative flex flex-col self-stretch ">
      <nav class="z-10 flex w-full sticky top-0 border-b border-ui">
        <div class="px-4 w-1/2 bg-background gap-3 h-[53px] font-semibold grow flex items-center ">
          <BackButton />
          <h1 class="flex items-center h-[52px] ">My Bookmarks</h1>
        </div>
      </nav>
      <Suspense>
        <Feed fetcher={getBookmarks} />
      </Suspense>
    </div>
  );
}
