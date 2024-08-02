import { Suspense } from 'solid-js';
import Trending, { TrendingSkeleton } from './Trending';
import FollowSuggestions, {
  FollowSuggestionsSkeleton,
} from './FollowSuggestions';
import SearchBar from './SearchBar';

export default function Sidebar() {
  return (
    <div class="flex flex-col gap-4">
      <div class="flex justify-center">
        <div class="w-full max-w-[350px]">
          <SearchBar />
        </div>
      </div>
      <Suspense fallback={<FollowSuggestionsSkeleton />}>
        <FollowSuggestions />
      </Suspense>
      <Suspense fallback={<TrendingSkeleton />}>
        <Trending />
      </Suspense>
    </div>
  );
}
