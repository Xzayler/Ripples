import { createSignal, createEffect, Show, useContext } from 'solid-js';
import { addFollow as follow, removeFollow as unfollow } from '~/lib/server';
import { UserContext } from '~/lib/UserContext';

export default function FollowButton(props: {
  isFollowed: boolean;
  uId: string;
}) {
  const user = useContext(UserContext);

  const [isFollowed, setIsFollowed] = createSignal<boolean>(
    props.isFollowed ?? false,
  );

  createEffect(() => {
    setIsFollowed((() => props.isFollowed ?? false)());
  });

  const pressFollow = () => {
    if (!isFollowed()) {
      setIsFollowed(true);
      follow(props.uId);
    } else {
      setIsFollowed(false);
      unfollow(props.uId);
    }
  };

  return (
    <button
      type="button"
      disabled={user && user() && user()!.id === props.uId}
      onclick={(e) => {
        e.preventDefault();
        pressFollow();
      }}
      class={
        'px-4 group cursor-pointer transition rounded-full border text-foreground border-foreground border-solid bg-background' +
        (isFollowed()
          ? ' hover:text-red-500 hover:border-red-500'
          : ' hover:text-background hover:bg-foreground ') +
        ' disabled:opacity-40 disabled:bg-neutral-800 disabled:text-foreground'
      }
    >
      <div class="flex items-center justify-center py-2">
        <span
          class={
            'text-sm font-bold ' +
            (isFollowed()
              ? " after:content-['Following'] group-hover:after:content-['Unfollow'] "
              : " after:content-['Follow']")
          }
        ></span>
      </div>
    </button>
  );
}

export function FollowButtonDisabled() {
  return (
    <button
      type="button"
      disabled={true}
      class="px-4 cursor-default rounded-full border border-gray-800 border-solid bg-gray-500 text-gray-800"
    >
      <div class="flex items-center justify-center py-2">
        <span class="text-sm font-bold">Follow</span>
      </div>
    </button>
  );
}
