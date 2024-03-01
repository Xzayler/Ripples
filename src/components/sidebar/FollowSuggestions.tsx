import FollowButton from "~/components/shared/FollowButton";

function Suggestion() {
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
            <FollowButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FollowSuggestions() {
  return (
    <div>
      <h2 class=" px-4 py-3 text-foreground text-xl font-extrabold ">
        Who to follow
      </h2>
      <Suggestion />
      <Suggestion />
      <Suggestion />
      <Suggestion />
    </div>
  );
}
