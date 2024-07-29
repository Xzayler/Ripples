import { For, createResource } from 'solid-js';
import FollowButton, { FollowButtonDisabled } from '../user/FollowButton';
import type { User } from '~/types';
import { getSuggestedUsers } from '~/lib/server';
import UserWrapper from '../user/UserWrapper';
import UserPfp from '../user/UserPfp';

function Suggestion(props: { user: User }) {
  return (
    <div class="px-4 py-3 hover:bg-highlightextra ">
      <div class="flex gap-2 items-center">
        <div class="w-10 h-10 rounded-full">
          <UserPfp pfp={props.user.pfp} />
        </div>
        <div class="flex flex-row grow justify-between">
          <UserWrapper handle={props.user.handle}>
            <div class="flex flex-col">
              <span class="text-foreground text-md font-bold">
                {props.user.name}
              </span>
              <span class="text-faint text-sm ">{`@${props.user.handle}`}</span>
            </div>
          </UserWrapper>
          <div class="ml-3 flex items-center">
            <FollowButton
              isFollowed={props.user.isFollowed}
              uId={props.user.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FollowSuggestions() {
  const [users] = createResource(async () => {
    return ((await getSuggestedUsers()) ?? []) as User[];
  });
  return (
    <div
      class="rounded-2xl bg-highlight overflow-hidden"
      onclick={() => console.log(users())}
    >
      <h2 class=" px-4 py-3 text-foreground text-xl font-extrabold ">
        Who to follow
      </h2>
      <For
        each={users()}
        fallback={<div class="px-4 py-3 text-sm">No users to follow</div>}
      >
        {(item) => {
          return <Suggestion user={item} />;
        }}
      </For>
    </div>
  );
}

// Skeletons

export function FollowSuggestionsSkeleton() {
  return (
    <div>
      <h2 class=" px-4 py-3 text-foreground text-xl font-extrabold ">
        Who to follow
      </h2>
      <SuggestionSkeleton />
      <SuggestionSkeleton />
      <SuggestionSkeleton />
      <SuggestionSkeleton />
      <SuggestionSkeleton />
    </div>
  );
}

function SuggestionSkeleton() {
  return (
    <div class="px-4 py-3 hover:bg-highlightextra ">
      <div class="flex flex-row items-center">
        <div class="bg-gray-400 w-10 h-10 rounded-md mr-4"></div>
        <div class="flex flex-row grow justify-between">
          <div class="flex flex-col">
            <span class="text-foreground text-md font-bold">User</span>
            <span class="text-faint text-sm ">@user</span>
          </div>
          <div class="ml-3 flex items-center">
            <FollowButtonDisabled />
          </div>
        </div>
      </div>
    </div>
  );
}
