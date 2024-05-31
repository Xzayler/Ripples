import { For } from "solid-js";
import { Ripple } from "~/types";
import { useNavigate } from "@solidjs/router";
import Reactions from "./Reactions";
import { calcDate } from "~/lib/date";
import UserWrapper from "../user/UserWrapper";

function Parent(props: { parent: Ripple }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/post/${props.parent.id}`);
      }}
      class="flex gap-3 w-full pb-1 cursor-pointer"
    >
      <div class="flex gap-1 flex-col items-center basis-10">
        <div class="h-10 w-10 bg-gray-300 rounded-full"></div>
        <div class="grow border-x border-ui border-solid"></div>
      </div>
      <div class="flex text-md flex-col w-full">
        {/* Post Meta */}
        <div class="flex flex-row">
          <div class="mr-1">
            <UserWrapper handle={props.parent ? props.parent.authorHandle : ""}>
              <span class="font-bold text-foreground">
                {props.parent.authorName}
              </span>
            </UserWrapper>
          </div>
          <div class="flex text-faint">
            <UserWrapper handle={props.parent ? props.parent.authorHandle : ""}>
              <div>
                <span>{`@${props.parent.authorHandle}`}</span>
              </div>
            </UserWrapper>
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
        return <Parent parent={item} />;
      }}
    </For>
  );
}
