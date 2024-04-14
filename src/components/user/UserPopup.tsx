import { createResource, Show } from "solid-js";
//@ts-ignore
import defaultPfp from "./defaultPfp.png";
import { getUserSummary } from "~/lib/server";
import FollowButton from "./FollowButton";

export default function UserPopup(props: { userHandle: string }) {
  const [user] = createResource(() => {
    return getUserSummary(props.userHandle);
  });

  return (
    <div class="absolute cursor-default w-[256px] bottom-full left-1/2 -translate-x-[50%]">
      <div class="flex flex-col p-4 gap-2 mb-2 rounded-2xl bg-background shadow-[0px_0px_4px_rgba(255,255,255,0.3)] overflow-hidden">
        <div class="flex justify-between w-full">
          <Show
            when={user()?.pfp}
            fallback={
              <img
                src={defaultPfp}
                alt="default profile picture"
                class="w-16 h-16 object-cover"
              />
            }
          >
            {(pfp) => (
              <img
                src={pfp()}
                alt="user profile picture"
                class="w-16 h-16 object-cover "
              />
            )}
          </Show>
          <div>
            <FollowButton />
          </div>
        </div>
        <Show
          when={user()}
          fallback={
            <div>
              <div class=" w-3/5 bg-gray-400 h-"></div>
              <div class=" w-2/5 bg-gray-400 h-"></div>
            </div>
          }
        >
          <div class="flex flex-col">
            <span class="font-bold text-foreground">{user()!.name}</span>
            <span class="text-faint">{`@${user()!.handle}`}</span>
          </div>
        </Show>
        <Show when={user()?.bio} fallback={null}>
          <p>{user()!.bio}</p>
        </Show>
        <div class="flex text-sm gap-3">
          <div>
            <Show
              when={user()}
              fallback={<div class="w-5 h-5 bg-gray-400 rounded-sm"></div>}
            >
              <span class="text-foreground">{user()!.following}</span>
            </Show>
            <span class="text-faint">{" Following"}</span>
          </div>
          <div>
            <Show
              when={user()}
              fallback={<div class="w-5 h-5 bg-gray-400 rounded-sm"></div>}
            >
              <span class="text-foreground">{user()!.followers}</span>
            </Show>
            <span class="text-faint">{" Followers"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
