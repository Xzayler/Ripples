import Feed from "~/components/feed/Feed";
import { getSubFeed, getFeed } from "~/lib/server";

export default function Home() {
  return (
    <Feed
      fetcher={getSubFeed}
      // fetcher={() => {
      //   return new Promise((resolve) => {
      //     resolve([]);
      //   });
      // }}
    />
  );
}
