import { createResource, Show } from 'solid-js';
import UserPfp from './UserPfp';
import { getUserSummary } from '~/lib/server';
import FollowButton, { FollowButtonDisabled } from './FollowButton';
import MultiLineText from '../shared/MultiLineText';

export default function UserPopup(props: { userHandle: string }) {
  const [user] = createResource(() => {
    return getUserSummary(props.userHandle);
  });

  return (
    <div class="absolute cursor-default w-[256px] bottom-full left-1/2 -translate-x-[50%]">
      <div class="flex flex-col p-4 gap-2 mb-2 rounded-2xl bg-background shadow-[0px_0px_4px_rgba(255,255,255,0.3)] overflow-hidden">
        <div class="flex justify-between w-full">
          <div class=" w-16 aspect-square rounded-full ">
            <UserPfp pfp={user()?.pfp} />
          </div>
          <Show
            when={user()}
            fallback={
              <div>
                <FollowButtonDisabled />
              </div>
            }
          >
            <div>
              <FollowButton uId={user()!.id} isFollowed={user()!.isFollowed} />
            </div>
          </Show>
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
          <p>
            <MultiLineText text={user()!.bio} />
          </p>
        </Show>
        <div class="flex text-sm gap-3">
          <div>
            <Show
              when={user()}
              fallback={<div class="w-5 h-5 bg-gray-400 rounded-sm"></div>}
            >
              <span class="text-foreground">{user()!.following}</span>
            </Show>
            <span class="text-faint">{' Following'}</span>
          </div>
          <div>
            <Show
              when={user()}
              fallback={<div class="w-5 h-5 bg-gray-400 rounded-sm"></div>}
            >
              <span class="text-foreground">{user()!.followers}</span>
            </Show>
            <span class="text-faint">{' Followers'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
