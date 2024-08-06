import { useAction, action } from '@solidjs/router';
import { createEffect, createSignal, Show } from 'solid-js';
import type { Ripple } from '~/types';
import {
  addBookmark,
  removeBookmark,
  likePost,
  unlikePost,
} from '~/lib/server';
import PostModal, { openModal } from '../shared/PostModal';
import LikeIcon from '../shared/icons/LikeIcon';
import CommentIcon from '../shared/icons/CommentIcon';
import RepostIcon from '../shared/icons/RepostIcon';
import BookmarkIcon from '../shared/icons/BookmarkIcon';
import Modal, { ModalHeadClose } from '../shared/Modal';

const defaultPost = {
  id: 'idasd',
  pfp: '',
  authorName: 'default',
  authorHandle: 'def',
  createdAt: new Date(),
  updatedAt: new Date(),
  content: 'Default',
  likes: 0,
  hasLiked: false,
  hasBookmarked: false,
  reposts: 0,
  comments: 0,
};

export default function Reactions(props: { post: Ripple | null | undefined }) {
  const like = useAction(action(likePost));
  const unlike = useAction(action(unlikePost));
  const bookmark = useAction(action(addBookmark));
  const unBookmark = useAction(action(removeBookmark));
  const [likesCount, setLikesCount] = createSignal<number>(
    props.post ? props.post.likes : 0,
  );
  const [hasLiked, setHasLiked] = createSignal<boolean>(
    props.post ? props.post.hasLiked : false,
  );
  const [hasBookmarked, setHasBookmarked] = createSignal<boolean>(
    props.post ? props.post.hasBookmarked : false,
  );
  const [repostModal, setRespostModal] = createSignal<boolean>(false);

  createEffect(() => {
    setLikesCount((() => (props.post ? props.post.likes : 0))());
    setHasLiked((() => (props.post ? props.post.hasLiked : false))());
    setHasBookmarked((() => (props.post ? props.post.hasBookmarked : false))());
  });

  const pressLike = () => {
    if (!hasLiked()) {
      setHasLiked(true);
      setLikesCount(likesCount() + 1);
      if (props.post) like(props.post.id);
    } else {
      setHasLiked(false);
      setLikesCount(likesCount() - 1);
      if (props.post) unlike(props.post.id);
    }
  };

  const pressBookmark = () => {
    if (!hasBookmarked()) {
      setHasBookmarked(true);
      if (props.post) bookmark(props.post.id);
    } else {
      setHasBookmarked(false);
      if (props.post) unBookmark(props.post.id);
    }
  };

  const [a, setActive] = createSignal<boolean>(false);

  return (
    <div class="flex flex-row justify-between ">
      <div
        class="cursor-pointer flex items-center text-faint hover:text-comment"
        onClick={(e) => {
          e.preventDefault();
          openModal(() => setActive(true));
          e.stopPropagation();
        }}
      >
        {/* <div class="h-[18px] w-[18px] rounded-sm bg-faint">
        </div> */}
        <div class="h-4 w-auto">
          <CommentIcon />
        </div>
        <div class="px-2">
          <span class="text-sm">{props.post ? props.post.comments : []}</span>
        </div>
        <Show when={a()}>
          <PostModal
            closeFn={() => setActive(false)}
            parent={props.post ?? undefined}
          />
        </Show>
      </div>
      <div
        class={
          'cursor-pointer flex items-center ' +
          (hasLiked() ? ' text-like ' : ' text-faint fill-transparent ') +
          ' hover:text-like'
        }
        onclick={(e) => {
          e.preventDefault();
          pressLike();
          e.stopPropagation();
        }}
      >
        {/* <div class="h-[18px] w-[18px] rounded-sm bg-faint "></div> */}
        <div class="h-4 w-auto">
          <LikeIcon toFill={hasLiked()} />
        </div>
        <div class="px-2">
          <span class=" text-sm">{likesCount()}</span>
        </div>
      </div>
      <div
        class={
          'cursor-pointer flex items-center hover:text-repost ' + 'text-faint'
          // + (hasReposted() ? " text-repost" : "text-faint") For future implementation
        }
        onClick={(e: Event) => {
          setRespostModal(true);
          e.stopPropagation();
        }}
      >
        <Show when={repostModal()}>
          <Modal>
            <ModalHeadClose closeFn={() => setRespostModal(false)} />
            <div class="w-full pt-16 pb-20 flex items-center justify-center text-xl text-foreground">
              Feature not implemented yet
            </div>
          </Modal>
        </Show>
        <div class="h-4 w-auto">
          <RepostIcon />
        </div>
        <div class="px-2">
          <span class="text-sm">{props.post ? props.post.reposts : 0}</span>
        </div>
      </div>
      <div class="flex items-center ">
        <div
          onclick={(e) => {
            e.preventDefault();
            pressBookmark();
            e.stopPropagation();
          }}
          class={
            'h-6 w-auto hover:text-comment ' +
            (hasBookmarked() ? 'text-comment' : 'text-faint')
          }
        >
          <BookmarkIcon toFill={hasBookmarked()} />
        </div>
      </div>
    </div>
  );
}
