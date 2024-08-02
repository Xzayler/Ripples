import { useParams } from '@solidjs/router';
import Sidebar from '~/components/sidebar/Sidebar';
import { getPost } from '~/lib/server';
import { createResource, For, useContext } from 'solid-js';
import Ripple from '~/components/feed/Ripple';
import MainRipple from '~/components/feed/MainRipple';
import { Suspense } from 'solid-js';
import BackButton from '~/components/shared/BackButton';
import type { Ripple as RippleType } from '~/types';
import { UserContext } from '~/lib/UserContext';

export default function Post() {
  const params = useParams();
  const [post, { mutate }] = createResource(
    () => params.postid,
    (postid) => {
      return getPost(postid);
    },
  );
  const user = useContext(UserContext);

  const addComment = (comment: string, id: string) => {
    // const p = structuredClone(post()) as RippleType;
    const p = { ...post() } as RippleType;
    if (!p) return;
    if (!user || !user()) return;
    const c: RippleType = {
      id: id,
      authorName: user()!.name,
      authorHandle: user()!.handle,
      pfp: user()!.pfp,
      content: comment,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      hasBookmarked: false,
      hasLiked: false,
      reposts: 0,
      updatedAt: new Date(),
    };
    if (user()!.pfp) c.pfp = user()!.pfp!;
    !p.children ? (p.children = [c]) : p.children!.unshift(c);
    mutate(p);
  };

  return (
    <div class="h-full relative">
      <nav class="z-10 pl-8 @[31.25rem]/content:pl-0 bg-background flex w-full sticky top-0 border-b border-ui">
        <div class="px-4 w-1/2 gap-3 h-[53px] font-semibold grow flex items-center ">
          <BackButton />
          <div class="flex items-center h-[52px] ">Post</div>
        </div>
      </nav>
      <Suspense fallback={<div>Loading...</div>}>
        <MainRipple post={post()} addComment={addComment} />
        <For each={post() ? post()!.children : []}>
          {(item) => {
            return <Ripple post={item} />;
          }}
        </For>
      </Suspense>
    </div>
  );
}
