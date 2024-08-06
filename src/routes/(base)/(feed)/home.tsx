import Feed from '~/components/feed/Feed';
import { getFeed } from '~/lib/server';
import { Title } from '@solidjs/meta';

export default function Home() {
  return (
    <>
      <Title>Home | Waves</Title>
      <Feed fetcher={getFeed} />
    </>
  );
}
