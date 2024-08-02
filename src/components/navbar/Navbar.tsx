import { useLocation } from '@solidjs/router';
import { createMemo, createSignal } from 'solid-js';
import MenuItem from './MenuItem';
import PostButton from '~/components/shared/PostButton';
import UserProfile from './UserProfile';
import HomeIcon from '~/components/shared/icons/HomeIcon';
import MessageIcon from '~/components/shared/icons/MessageIcon';
import BookmarkIcon from '~/components/shared/icons/BookmarkIcon';
import WavesIcon from '~/components/shared/icons/WavesIcon';

export default function Navbar(props: { isOpen: boolean }) {
  const location = useLocation();

  const pathname = createMemo(() => location.pathname);

  return (
    <header
      class={
        'z-50 overflow-y-auto px-2 transition-transform @[31.25rem]/content:translate-x-0 bg-background @[1px]/nav:translate-x-0 w-min items-end @[259px]/nav:items-stretch h-screen flex flex-col justify-between' +
        (props.isOpen ? '' : ' -translate-x-full')
      }
    >
      <div class="pt-6 px-1.5 flex flex-col grow items-center @[259px]/nav:items-start ">
        <div class="max-w-14 h-8 w-full">
          <WavesIcon />
        </div>
        <nav class="pb-3 flex flex-col items-end @[259px]/nav:items-start my-1">
          <MenuItem href={'/home'} text="Home">
            <HomeIcon
              toFill={pathname() == '/home' || pathname() == '/follows'}
            />
          </MenuItem>
          <MenuItem href={'/messages'} text="Messages">
            <MessageIcon toFill={pathname() === '/messages'} />
          </MenuItem>
          <MenuItem href={'/bookmarks'} text="Bookmarks">
            <BookmarkIcon toFill={pathname() === '/bookmarks'} />
          </MenuItem>
        </nav>
        <div class=" my-1 w-[50px] @[259px]/nav:w-full ">
          <PostButton></PostButton>
        </div>
      </div>
      <div class="mt-3 mb-3">
        <UserProfile />
      </div>
    </header>
  );
}
