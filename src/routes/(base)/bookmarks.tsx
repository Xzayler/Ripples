import Feed from '~/components/feed/Feed';
import { getBookmarks } from '~/lib/server';
import BackButton from '~/components/shared/BackButton';
import { Title } from '@solidjs/meta';

export default function Bookmarks() {
  return (
    <>
      <Title>Bookmarks | Waves</Title>
      <div class="relative flex flex-col self-stretch h-full">
        <nav class="z-10 pl-8 @[31.25rem]/content:pl-0 @[31.] flex w-full sticky top-0 border-b border-ui">
          <div class="px-4 w-1/2 bg-background gap-3 h-[53px] font-semibold grow flex items-center ">
            <BackButton />
            <h1 class="flex items-center h-[52px] ">My Bookmarks</h1>
          </div>
        </nav>
        <Feed fetcher={getBookmarks} />
      </div>
    </>
  );
}
