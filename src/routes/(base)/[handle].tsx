import { useParams } from "@solidjs/router";
import {
  Switch,
  Match,
  Show,
  For,
  createResource,
  Suspense,
  useContext,
  createSignal,
} from "solid-js";
import { getUserData, getUserLikedPosts, getUserPosts } from "~/lib/server";
import Sidebar from "~/components/sidebar/Sidebar";
import BackButton from "~/components/shared/BackButton";
import FollowButton from "~/components/user/FollowButton";
import Feed from "~/components/feed/Feed";
import { UserContext } from "~/lib/UserContext";
import EditProfileModal, {
  openModal,
} from "~/components/user/EditProfileModal";
import UserPfp from "~/components/user/UserPfp";

export default function UserPage() {
  const params = useParams();
  const [user] = createResource(() => {
    return getUserData(params.handle);
  });
  const currUser = useContext(UserContext);
  const [editActive, setEditActive] = createSignal<boolean>(false);

  const [toShow, setToShow] = createSignal<"posts" | "likes">("posts");

  return (
    <main class="w-[990px] flex justify-between h-full relative items-end ">
      <div class="shrink w-[600px] relative flex flex-col self-stretch ">
        <nav class="flex w-full sticky top-0 border-b border-ui z-50">
          <div class="px-4 w-1/2 bg-background gap-3 h-[53px] font-semibold grow flex items-center ">
            <BackButton />
            <h1 class="flex items-center h-[52px] ">{user()?.name}</h1>
          </div>
        </nav>
        {/* User Data*/}
        <div class="w-full p-4 flex flex-col gap-3">
          <Show when={user()}>
            <div class="flex gap-4 justify-between w-full">
              <div class="flex flex-col gap-2 items-start">
                <div class="w-24 h-24">
                  <Show when={user()?.pfp} fallback={<UserPfp />}>
                    <UserPfp pfp={user()!.pfp} />
                  </Show>
                </div>
                <div>
                  <div class="text-foreground font-bold text-3xl ">
                    {user()!.name}
                  </div>
                  <div class="text-faint">{`@${user()!.handle}`}</div>
                </div>
              </div>
              <div>
                <Switch
                  fallback={
                    <FollowButton
                      isFollowed={user()!.isFollowed}
                      uId={user()!.id}
                    />
                  }
                >
                  <Match
                    when={
                      currUser != undefined &&
                      user()?.handle == currUser()?.handle
                    }
                  >
                    <button
                      type="button"
                      onclick={(e) => {
                        openModal(() => setEditActive(true));
                      }}
                      class={
                        "px-4 group cursor-pointer transition rounded-full border text-foreground border-foreground border-solid bg-background hover:text-background hover:bg-foreground "
                      }
                    >
                      <div class="flex items-center justify-center py-2">
                        <span class="text-sm font-bold ">Edit Profile</span>
                      </div>
                    </button>
                    <Show when={editActive()}>
                      <EditProfileModal
                        closeFn={() => {
                          setEditActive(false);
                        }}
                      />
                    </Show>
                  </Match>
                </Switch>
              </div>
            </div>
            <Show when={user()?.bio != ""}>
              <p>
                <For each={user()!.bio.split("\n")}>
                  {(line) => {
                    return (
                      <>
                        {line}
                        <br />
                      </>
                    );
                  }}
                </For>
              </p>
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
          </Show>
        </div>
        <div class="mt-4 flex border-b border-ui">
          <div
            class={`flex w-1/2 grow items-stretch justify-center cursor-pointer py-2 hover:bg-highlight ${
              toShow() == "posts"
                ? " underline decoration-accent decoration-8 underline-offset-8"
                : ""
            }`}
            onclick={() => {
              setToShow("posts");
            }}
          >
            Posts
          </div>
          <div
            class={`flex w-1/2 grow items-stretch justify-center cursor-pointer py-2 hover:bg-highlight ${
              toShow() == "likes"
                ? " underline decoration-accent decoration-8 underline-offset-8"
                : ""
            }`}
            onclick={() => {
              setToShow("likes");
            }}
          >
            Likes
          </div>
        </div>
        <Suspense>
          <Switch
            fallback={
              <div class="w-full h-full flex items-center justify-center">
                Loading...
              </div>
            }
          >
            <Match when={user() && toShow() == "posts"}>
              <Feed fetcher={() => getUserPosts(user()!.id)} />
            </Match>
            <Match when={user() && toShow() == "likes"}>
              <Feed fetcher={() => getUserLikedPosts(user()!.id)} />
            </Match>
          </Switch>
        </Suspense>
      </div>
      <div class="shrink w-[350px] mr-[10px] border-l border-ui p">
        <Sidebar />
      </div>
    </main>
  );
}
