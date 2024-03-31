import { For } from "solid-js";
import { Ripple } from "~/types";
import { A } from "@solidjs/router";
import Reactions from "./Reactions";
import { calcDate } from "~/lib/date";

function Parent(props: { parent: Ripple }) {
  return (
    <div class="flex gap-3 w-full pb-1">
      <div class="flex gap-1 flex-col items-center basis-10">
        <div class="h-10 w-10 bg-gray-300 rounded-full"></div>
        <div class="grow border-x border-ui border-solid"></div>
      </div>
      <div class="flex text-md flex-col w-full">
        {/* Post Meta */}
        <div class="flex flex-row">
          <div class="mr-1">
            <span class="font-bold text-foreground">
              {props.parent.authorName}
            </span>
          </div>
          <div class="flex text-faint">
            <div>
              <span>{`@${props.parent.authorHandle}`}</span>
            </div>
            <div class="px-1">
              <span>⋅</span>
            </div>
            <div>
              <span>{calcDate(props.parent.createdAt)}</span>
            </div>
          </div>
        </div>
        {/* Post Content */}
        <div>{props.parent.content}</div>
        <div class="py-4">
          <Reactions post={props.parent} />
        </div>
      </div>
    </div>
  );
}

export default function ParentChain(props: { ancestors: Ripple[] }) {
  return (
    <For each={props.ancestors}>
      {(item) => {
        return (
          <A href={`/post/${item.id}`}>
            <Parent parent={item} />
          </A>
        );
      }}
    </For>
  );
}
