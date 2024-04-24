import { useParams, A } from "@solidjs/router";
import { Show, createResource, Suspense } from "solid-js";
import { getUserData, getUserPosts } from "~/lib/server";
import Sidebar from "~/components/sidebar/Sidebar";
import FollowButton, {
  FollowButtonDisabled,
} from "~/components/user/FollowButton";
import Feed from "~/components/feed/Feed";
//@ts-ignore
import defaultPfp from "~/assets/pfps/defaultPfp.png";

export default function UserPage() {
  const params = useParams();
  const [user] = createResource(() => {
    return getUserData(params.handle);
  });
  return (
    <main class="w-[990px] flex justify-between h-full relative items-end ">
      <div class="shrink w-[600px] relative flex flex-col self-stretch ">
        <nav class="flex w-full sticky top-0 border-b border-ui z-50">
          <div class="px-4 w-1/2 bg-background gap-3 h-[53px] font-semibold grow flex items-center ">
            <A
              href="/home"
              class=" w-8 aspect-square p-1 rounded-full hover:bg-ui "
            >
              {"<-"}
            </A>
            <h1 class="flex items-center h-[52px] ">{user()?.name}</h1>
          </div>
        </nav>
        {/* User Data*/}
        <div class="w-full p-4 flex flex-col gap-3">
          <Show when={user()}>
            <div class="flex gap-4 justify-between w-full">
              <div class="flex flex-col gap-2 items-start">
                <Show
                  when={user()?.pfp}
                  fallback={
                    <div class="bg-gray-300 rounded-full  ">
                      <img
                        src={defaultPfp}
                        alt="default profile picture"
                        class="w-24 h-24 object-cover"
                      />
                    </div>
                  }
                >
                  <img
                    src={user()!.pfp}
                    alt="user profile picture"
                    class="w-16 h-16 object-cover "
                  />
                </Show>
                <div>
                  <div class="text-foreground font-bold text-3xl ">
                    {user()!.name}
                  </div>
                  <div class="text-faint">{`@${user()!.handle}`}</div>
                </div>
              </div>
              <div>
                <FollowButton
                  isFollowed={user()!.isFollowed}
                  uId={user()!.id}
                />
              </div>
            </div>
            <Show when={user()?.bio != ""}>
              <div>{user()!.bio}</div>
            </Show>
            <div class="flex gap-3 text-md">
              <div class="flex gap-1">
                <span class="text-foreground">{`${user()!.following}`}</span>
                <span class="text-faint">Following</span>
              </div>
              <div class="flex gap-1">
                <span class="text-freground">{`${user()!.followers}`}</span>
                <span class="text-faint ">Followers</span>
              </div>
            </div>
            {/* Followed by others  */}
          </Show>
        </div>
        <div class="mt-4 flex border-b border-ui">
          <div class="flex w-1/2 grow items-stretch justify-center cursor-pointer py-2 hover:bg-highlight">
            Posts
          </div>
          <div class="flex w-1/2 grow items-stretch justify-center cursor-pointer py-2 hover:bg-highlight">
            Likes
          </div>
        </div>
        <Show when={user()}>
          <Suspense>
            <Feed fetcher={() => getUserPosts(user()!.id)} />
          </Suspense>
        </Show>
      </div>
      <div class="shrink w-[350px] mr-[10px] border-l border-ui p">
        <Sidebar />
      </div>
    </main>
  );
}
