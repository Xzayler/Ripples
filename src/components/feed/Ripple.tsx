import { likePost, unlikePost } from "~/lib/server";
import { action, useAction } from "@solidjs/router";
import { type Ripple } from "~/types";
import { createSignal } from "solid-js";
import { openCommentModal } from "../shared/PostModal";

function PostReactions(props: { post: Ripple }) {
  const { post } = props;
  const like = useAction(action(likePost));
  const unlike = useAction(action(unlikePost));
  const [likesCount, setLikesCount] = createSignal<number>(post.likes);
  const [hasLiked, setHasLiked] = createSignal<boolean>(post.hasLiked);

  const pressLike = () => {
    if (!hasLiked()) {
      console.log("liking");
      setHasLiked(true);
      setLikesCount(likesCount() + 1);
      like(post.id);
    } else {
      console.log("unlike");
      setHasLiked(false);
      setLikesCount(likesCount() - 1);
      unlike(post.id);
    }
  };

  return (
    <div class="mt-6 flex flex-row justify-between ">
      <div
        class="flex items-center text-faint hover:text-comment"
        onClick={() => {
          openCommentModal(post);
        }}
      >
        <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
        <div class="px-2">
          <span class="text-sm">{post.comments}</span>
        </div>
      </div>
      <div
        class={
          "flex items-center " +
          (hasLiked() ? " text-like " : " text-faint ") +
          " hover:text-like"
        }
        onClick={pressLike}
      >
        <div class="h-[18px] w-[18px] rounded-sm bg-faint "></div>
        <div class="px-2">
          <span class=" text-sm">{likesCount()}</span>
        </div>
      </div>
      <div class="flex items-center text-faint hover:text-repost">
        <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
        <div class="px-2">
          <span class="text-sm">{post.reposts}</span>
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

export default function Ripple({ post }: { post: Ripple }) {
  const {
    id,
    authorName,
    authorHandle,
    pfp,
    createdAt,
    updatedAt,
    content,
    likes,
    hasLiked,
    reposts,
    comments,
  } = post;
  return (
    <div class="w-full cursor-pointer border-ui border-b">
      <article class="px-4 flex flex-col w-full">
        {/* retweeted by.. */}
        <div class="pt-3 mb-2">
          <div class="flex gap-3 align-center">
            <div class=" basis-10 flex justify-end ">
              <div class="bg-gray-300 rounded-sm h-4 w-4"></div>
            </div>
            <div class="flex align-center">
              <span class="font-bold text-faint text-[13px] leading-4 ">
                User reposted
              </span>
            </div>
          </div>
        </div>
        {/* content */}
        <div class="flex gap-3 w-full">
          <div class="basis-10">
            <div class="h-10 w-10 bg-gray-300 rounded-full"></div>
          </div>
          <div class="flex text-md flex-col w-full">
            {/* Post Meta */}
            <div class="flex flex-row">
              <div class="mr-1">
                <span class="font-bold text-foreground">{authorName}</span>
              </div>
              <div class="flex text-faint">
                <div>
                  <span>{`@${authorHandle}`}</span>
                </div>
                <div class="px-1">
                  <span>⋅</span>
                </div>
                <div>
                  {/* <span>{`${date.getMonth()} ${date.getDate()}`}</span> */}
                  <span>{createdAt.toUTCString()}</span>
                </div>
              </div>
            </div>
            {/* Post Content */}
            <div>{content}</div>
            {/* Post Reactions */}
            <div class="mb-3 w-full">
              <PostReactions post={post} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
