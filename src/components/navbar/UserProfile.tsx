import { useNavigate } from '@solidjs/router';
import UserProfileMenu from './UserProfileMenu';
import { createSignal, useContext } from 'solid-js';
import { UserContext } from '~/lib/UserContext';
import { Show } from 'solid-js';
import UserPfp from '../user/UserPfp';

export default function UserProfile() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = createSignal<boolean>(false);

  return (
    <div
      class="group"
      onclick={() => {
        navigate(`/${user!() ? user!()!.handle : '/'}`);
      }}
    >
      <Show when={menuOpen()}>
        <div class="relative w-full">
          <div class=" absolute bottom-0 w-full">
            <UserProfileMenu handle={user!() ? user!()!.handle : 'loading'} />
          </div>
        </div>
      </Show>
      <div class="cursor-pointer rounded-full w-full p-3 flex items-center hover:bg-highlight">
        <div class="h-10 w-10 rounded-full shrink-0">
          <UserPfp pfp={user!() ? user!()!.pfp : undefined} />
        </div>
        <div class="flex-col mx-3 text-foreground hidden @[259px]/nav:flex">
          <span class="text-md font-bold ">
            {user!() ? user!()!.name : 'Loading'}
          </span>
          <span class="text-md text-faint">{`@${
            user!() ? user!()!.handle : 'loading'
          }`}</span>
        </div>
        <div class="grow justify-end hidden @[259px]/nav:flex">
          <div
            onclick={(e) => {
              setMenuOpen(!menuOpen());
              e.stopPropagation();
            }}
            class=" flex items-center justify-center px-1 hover:bg-highlightextra min-w-max aspect-square rounded-full "
          >
            <span class="text-base">⋅⋅⋅</span>
          </div>
        </div>
      </div>
    </div>
  );
}
