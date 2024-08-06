import Feed from '~/components/feed/Feed';
import { getSubFeed } from '~/lib/server';
import { Title } from '@solidjs/meta';

export default function Home() {
  return (
    <>
      <Title>Home | Waves</Title>
      <Feed fetcher={getSubFeed} />
    </>
  );
}
