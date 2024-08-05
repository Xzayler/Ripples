import { useParams } from '@solidjs/router';
import {
  Switch,
  Match,
  Show,
  createResource,
  useContext,
  createSignal,
  createEffect,
} from 'solid-js';
import { getUserData, getUserLikedPosts, getUserPosts } from '~/lib/server';
import BackButton from '~/components/shared/BackButton';
import FollowButton from '~/components/user/FollowButton';
import Feed from '~/components/feed/Feed';
import { UserContext } from '~/lib/UserContext';
import EditProfileModal, {
  openModal,
} from '~/components/user/EditProfileModal';
import UserPfp from '~/components/user/UserPfp';
import MultiLineText from '~/components/shared/MultiLineText';
import Loading from '~/components/shared/Loading';

export default function UserPage() {
  const params = useParams();
  const [user] = createResource(
    () => params.handle,
    (handle) => {
      const res = getUserData(handle);
      return res;
    },
  );

  const currUser = useContext(UserContext);
  const [editActive, setEditActive] = createSignal<boolean>(false);

  const [toShow, setToShow] = createSignal<'posts' | 'likes'>('posts');

  createEffect(() => {
    const id = params.handle;
    setToShow('posts');
  });

  return (
    <div class="relative flex flex-col self-stretch h-full">
      <nav class="z-10 bg-background pl-8 @[31.25rem]/content:pl-0 flex w-full sticky top-0 border-b border-ui">
        <div class="px-4 w-1/2 gap-3 h-[53px] font-semibold grow flex items-center ">
          <BackButton />
          <h1 class="flex items-center h-[52px] ">
            {user() ? user()!.name : 'Profile'}
          </h1>
        </div>
      </nav>
      {/* User Data*/}
      <Switch>
        <Match when={user.loading}>
          <Loading />
        </Match>
        <Match when={user()}>
          <div class="w-full p-4 flex flex-col gap-3">
            <div class="flex gap-4 justify-between w-full">
              <div class="flex flex-col gap-2 items-start">
                <div class="w-24 h-24">
                  <UserPfp pfp={user()!.pfp} />
                </div>
              </div>
              <div class="min-w-max">
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
                        'px-4 group cursor-pointer transition rounded-full border text-foreground border-foreground border-solid bg-background hover:text-background hover:bg-foreground '
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
            <div>
              <div class="text-foreground break-words font-bold text-3xl ">
                {user()!.name}
              </div>
              <div class="text-faint">{`@${user()!.handle}`}</div>
            </div>
            <Show when={user()!.bio != ''}>
              <p>
                <MultiLineText text={user()!.bio} />
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
          </div>
          <div class="mt-4 flex border-b border-ui">
            <div
              class={`flex w-1/2 grow items-stretch justify-center cursor-pointer py-2 hover:bg-highlight ${
                toShow() == 'posts'
                  ? ' underline decoration-accent decoration-4 underline-offset-8'
                  : ''
              }`}
              onclick={() => {
                setToShow('posts');
              }}
            >
              Posts
            </div>
            <div
              class={`flex w-1/2 grow items-stretch justify-center cursor-pointer py-2 hover:bg-highlight ${
                toShow() == 'likes'
                  ? ' underline decoration-accent decoration-4 underline-offset-8'
                  : ''
              }`}
              onclick={() => {
                setToShow('likes');
              }}
            >
              Likes
            </div>
          </div>
          {/* <Feed fetcher={} /> */}
          <Switch>
            <Match when={toShow() == 'posts'}>
              <Feed fetcher={(id) => getUserPosts(id)} arg={user()!.id} />
            </Match>
            <Match when={toShow() == 'likes'}>
              <Feed fetcher={(id) => getUserLikedPosts(id)} arg={user()!.id} />
            </Match>
          </Switch>
        </Match>
        <Match when={!user.loading && user() == null}>
          <div class="h-full flex flex-col text-foreground items-center justify-center px-5">
            <div class="text-2xl font-bold">User doesn't exist</div>
            <p class="text-xl">Sorry :/</p>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
