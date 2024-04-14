import { Ripple } from "~/types";
import { Show } from "solid-js";
import Reactions from "./Reactions";
import ParentChain from "./ParentChain";
import WriteComment from "./WriteComment";
import UserWrapper from "../user/UserWrapper";

export default function MainRipple(props: { post: Ripple | undefined | null }) {
  return (
    <div class="px-4 border-b border-ui">
      <div class="pt-3 pb-2"></div>
      {props.post
        ? props.post.ancestors && (
            <ParentChain ancestors={props.post.ancestors} />
          )
        : null}
      <article class="flex flex-col w-full">
        <div class=" w-full flex-col gap-3">
          <div class="flex gap-2 items-center text-md">
            <div class="basis-10">
              <div class="h-10 w-10 bg-gray-300 rounded-full"></div>
            </div>
            <div class="flex flex-col">
              <div class="mr-1">
                <UserWrapper handle={props.post ? props.post.authorHandle : ""}>
                  <span class="font-bold text-foreground">
                    {props.post ? props.post.authorName : ""}
                  </span>
                </UserWrapper>
              </div>
              <div class="flex text-faint">
                <UserWrapper handle={props.post ? props.post.authorHandle : ""}>
                  <span>{`@${props.post ? props.post.authorHandle : ""}`}</span>
                </UserWrapper>
              </div>
            </div>
          </div>
          <div class="flex text-md flex-col w-full">
            <div>{props.post ? props.post.content : ""}</div>
          </div>
        </div>
        <div class="my-4">
          <span class="text-faint ">
            {props.post
              ? props.post.createdAt.toLocaleTimeString("default", {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : ""}{" "}
            <span>⋅</span>{" "}
            {`${
              props.post
                ? props.post.createdAt.toLocaleString("default", {
                    month: "short",
                  })
                : ""
            } ${props.post ? props.post.createdAt.getDate() : ""}, ${
              props.post ? props.post.createdAt.getFullYear() : ""
            }`}
          </span>
        </div>
      </article>
      <div class="border-b border-ui"></div>
      <div class="my-4 w-full">
        <Reactions post={props.post} />
      </div>
      <div class="border-b border-ui"></div>
      <WriteComment
        parentid={props.post ? props.post.id : ""}
        replyTo={props.post ? props.post.authorHandle : ""}
      />
    </div>
  );
}
