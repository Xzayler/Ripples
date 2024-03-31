import { useAction, action } from "@solidjs/router";
import { createEffect, createSignal, useContext } from "solid-js";
import type { Ripple } from "~/types";
import {
  addBookmark,
  removeBookmark,
  likePost,
  unlikePost,
} from "~/lib/server";
import { openCommentModal } from "../shared/PostModal";

const defaultPost = {
  id: "idasd",
  pfp: "",
  authorName: "default",
  authorHandle: "def",
  createdAt: new Date(),
  updatedAt: new Date(),
  content: "Default",
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
    props.post ? props.post.likes : 0
  );
  const [hasLiked, setHasLiked] = createSignal<boolean>(
    props.post ? props.post.hasLiked : false
  );
  const [hasBookmarked, setHasBookmarked] = createSignal<boolean>(
    props.post ? props.post.hasBookmarked : false
  );

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

  return (
    <div class="flex flex-row justify-between ">
      <div
        class="cursor-pointer flex items-center text-faint hover:text-comment"
        onClick={(e) => {
          e.preventDefault();
          openCommentModal(props.post ?? defaultPost);
        }}
      >
        <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
        <div class="px-2">
          <span class="text-sm">{props.post ? props.post.comments : []}</span>
        </div>
      </div>
      <div
        class={
          "cursor-pointer flex items-center " +
          (hasLiked() ? " text-like " : " text-faint ") +
          " hover:text-like"
        }
        onclick={(e) => {
          e.preventDefault();
          pressLike();
        }}
      >
        <div class="h-[18px] w-[18px] rounded-sm bg-faint "></div>
        <div class="px-2">
          <span class=" text-sm">{likesCount()}</span>
        </div>
      </div>
      <div class="cursor-pointer flex items-center text-faint hover:text-repost">
        <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
        <div class="px-2">
          <span class="text-sm">{props.post ? props.post.reposts : 0}</span>
        </div>
      </div>
      <div class="flex">
        <div class="flex items-center mr-3 ">
          <div
            onclick={(e) => {
              e.preventDefault();
              pressBookmark();
            }}
            class={
              "h-[18px] w-[18px] rounded-sm " +
              (hasBookmarked() ? "bg-comment" : "bg-faint")
            }
          ></div>
        </div>
        <div class="flex items-center">
          <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
        </div>
      </div>
    </div>
  );
}
