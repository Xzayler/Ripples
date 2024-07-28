import { type Ripple } from "~/types";
import Reactions from "./Reactions";
import { calcDate } from "~/lib/date";
import UserWrapper from "../user/UserWrapper";
import { redirect, useNavigate } from "@solidjs/router";
import UserPfp from "../user/UserPfp";
import PostContent from "./PostContent";

export default function Ripple(props: { post: Ripple }) {
  const post = props.post;
  const { id, authorName, authorHandle, pfp, createdAt, content } = post;
  const navigate = useNavigate();

  return (
    <article
      onClick={() => {
        navigate(`/post/${id}`);
      }}
      class="px-4 flex flex-col w-full cursor-pointer border-solid border-b border-ui"
    >
      {/* retweeted by.. */}
      <div class="pt-3 pb-2">
        {/* <div class="flex gap-3 align-center">
            <div class=" basis-10 flex justify-end ">
              <div class="bg-gray-300 rounded-sm h-4 w-4"></div>
            </div>
            <div class="flex align-center">
              <span class="font-bold text-faint text-[13px] leading-4 ">
                User reposted
              </span>
            </div>
          </div> */}
      </div>
      {/* content */}
      <div class="flex gap-3 w-full">
        <div class="h-10 aspect-square rounded-full">
          <UserPfp pfp={pfp} />
        </div>
        <div class="flex text-md flex-col w-full">
          {/* Post Meta */}
          <div class="flex flex-row">
            <div class="mr-1">
              <UserWrapper handle={authorHandle}>
                <span class="hover:underline font-bold text-foreground">
                  {authorName}
                </span>
              </UserWrapper>
            </div>
            <div class="flex text-faint">
              <div>
                <UserWrapper handle={authorHandle}>
                  <span class="hover:underline">{`@${authorHandle}`}</span>
                </UserWrapper>
              </div>
              <div class="px-1">
                <span>⋅</span>
              </div>
              <div>
                <time dateTime={createdAt.toISOString()}>
                  {calcDate(createdAt)}
                </time>
              </div>
            </div>
          </div>
          {/* Post Content */}
          <p>
            <PostContent content={content} />
          </p>
          {/* Post Reactions */}
          <div class="mb-3 w-full my-3">
            <Reactions post={post} />
          </div>
        </div>
      </div>
    </article>
  );
}
