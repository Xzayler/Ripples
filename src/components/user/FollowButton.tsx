import { action, useAction } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { addFollow, removeFollow } from "~/lib/server";

export default function FollowButton(props: {
  isFollowed: boolean;
  uId: string;
}) {
  const follow = addFollow;
  const unfollow = removeFollow;
  const [isFollowed, setIsFollowed] = createSignal<boolean>(
    props.isFollowed ?? false
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
      onclick={(e) => {
        e.preventDefault();
        pressFollow();
      }}
      class={
        "px-4 group cursor-pointer transition rounded-full border text-foreground border-foreground border-solid bg-background " +
        (isFollowed()
          ? " hover:text-red-500 hover:border-red-500"
          : " hover:text-background hover:bg-foreground ")
      }
    >
      <div class="flex items-center justify-center py-2">
        <span
          class={
            "text-sm font-bold " +
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
