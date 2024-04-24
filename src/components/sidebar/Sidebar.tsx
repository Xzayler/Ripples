import Trending from "./Trending";
import FollowSuggestions from "./FollowSuggestions";
import Search from "./Search";

export default function Sidebar() {
  return (
    <div class="flex flex-col gap-4 sticky top-0 border-l border-ui">
      <Search />
      <div class="rounded-2xl bg-highlight">
        <FollowSuggestions />
      </div>
      <div class="rounded-2xl bg-highlight ">
        <Trending />
      </div>
    </div>
  );
}
