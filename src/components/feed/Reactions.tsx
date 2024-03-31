import { useAction, action } from "@solidjs/router";
import { createEffect, createSignal, useContext } from "solid-js";
import type { Ripple } from "~/types";
import { likePost, unlikePost } from "~/lib/server";
import { openCommentModal } from "../shared/PostModal";
import { UserContext } from "~/lib/UserContext";

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
  reposts: 0,
  comments: 0,
};

export default function Reactions(props: {
  post: Ripple | null | undefined;
  likes?: number;
}) {
  const like = useAction(action(likePost));
  const unlike = useAction(action(unlikePost));
  const [likesCount, setLikesCount] = createSignal<number>(
    props.post ? props.post.likes : 0
  );
  const [hasLiked, setHasLiked] = createSignal<boolean>(
    props.post ? props.post.hasLiked : false
  );

  createEffect(() => {
    setLikesCount((() => (props.post ? props.post.likes : 0))());
    setHasLiked((() => (props.post ? props.post.hasLiked : false))());
  });

  const pressLike = () => {
    if (!hasLiked()) {
      console.log("liking");
      setHasLiked(true);
      setLikesCount(likesCount() + 1);
      like(props.post ? props.post.id : "");
    } else {
      console.log("unlike");
      setHasLiked(false);
      setLikesCount(likesCount() - 1);
      unlike(props.post ? props.post.id : "");
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
          <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
        </div>
        <div class="flex items-center">
          <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
        </div>
      </div>
    </div>
  );
}
