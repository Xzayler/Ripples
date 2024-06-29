import { action } from "@solidjs/router";
import { submitComment } from "~/lib/server";
import { createSignal } from "solid-js";

const [postBody, setPostBody] = createSignal<string | null>("");

const updatePlaceholder = (e: Event) => {
  const el: HTMLElement = e.target as HTMLElement;
  setPostBody(el.textContent);
  if (el.textContent == "") {
    el.removeChild(el.firstChild!);
  }
};

export default function WriteComment(props: {
  parentid: string;
  replyTo: string;
}) {
  return (
    <form
      method="post"
      action={action((formData: FormData) => {
        return submitComment(formData, props.parentid);
      }, "postcomment")}
      class=" pt-2 "
    >
      <div class="pl-10">
        <p class="text-sm text-faint pl-2.5">
          Replying to <span class=" text-accent">{`@${props.replyTo}`}</span>
        </p>
      </div>
      <div class=" flex gap-2.5 pt-2 ">
        <div class="pt-3">
          <div class="h-10 w-10 bg-gray-300 rounded-full"></div>
        </div>
        <p
          contentEditable
          onInput={updatePlaceholder}
          class="pb-2 pt-5 overflow-hidden text-pretty [&:empty:not(:focus)]:after:content-['Write_your_reply'] after:text-faint grow text-xl leading-6 min-h-6 resize-none text-foreground outline-none bg-background focus-within:placeholder-background "
          id=""
        ></p>
        <textarea name="body" id="" class="hidden">
          {postBody()}
        </textarea>
      </div>
      <div class="flex justify-between pb-5 bg-background">
        <div></div>
        <button
          type="submit"
          class="px-4 py-2 cursor-pointer bg-accent transition hover:bg-accent/90 rounded-full text-white font-bold mt-2"
        >
          <div class="flex items-center justify-center">
            <span class="text-md">Reply</span>
          </div>
        </button>
      </div>
    </form>
  );
}
