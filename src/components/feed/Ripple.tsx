function PostReactions(props: {
  likes: number;
  comments: number;
  reposts: number;
}) {
  return (
    <div class="mt-6 flex flex-row">
      <div class="flex items-center grow">
        <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
        <div class="px-2">
          <span class="text-sm">{props.comments}</span>
        </div>
      </div>
      <div class="flex items-center grow">
        <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
        <div class="px-2">
          <span class=" text-sm">{props.likes}</span>
        </div>
      </div>
      <div class="flex items-center grow">
        <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
        <div class="px-2">
          <span class="text-faint text-sm">{props.reposts}</span>
        </div>
      </div>
      <div class="flex items-center mr-3 ">
        <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
      </div>
      <div class="flex items-center">
        <div class="h-[18px] w-[18px] rounded-sm bg-faint"></div>
      </div>
    </div>
  );
}

export default function Ripple({ post }: { post: Ripple }) {
  const {
    authorName,
    authorHandle,
    pfp,
    createdAt,
    updatedAt,
    content,
    likes,
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
              <PostReactions
                likes={likes}
                comments={comments}
                reposts={reposts}
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
