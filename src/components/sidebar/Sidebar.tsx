import { Suspense } from 'solid-js';
import Trending, { TrendingSkeleton } from './Trending';
import FollowSuggestions, {
  FollowSuggestionsSkeleton,
} from './FollowSuggestions';
import SearchBar from './SearchBar';

export default function Sidebar() {
  return (
    <div class="flex flex-col gap-4 ">
      <SearchBar />
      <Suspense fallback={<FollowSuggestionsSkeleton />}>
        <FollowSuggestions />
      </Suspense>
      <Suspense fallback={<TrendingSkeleton />}>
        <Trending />
      </Suspense>
    </div>
  );
}
