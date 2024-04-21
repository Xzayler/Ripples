import Feed from "~/components/feed/Feed";
import { getFeed } from "~/lib/server";

export default function Home() {
  return <Feed fetcher={getFeed} />;
}
