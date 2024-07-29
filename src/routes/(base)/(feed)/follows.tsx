import Feed from '~/components/feed/Feed';
import { getSubFeed } from '~/lib/server';

export default function Home() {
  return <Feed fetcher={getSubFeed} />;
}
