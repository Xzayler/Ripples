import { action } from "@solidjs/router";
import { createSignal } from "solid-js";
import { JSX } from "solid-js";
import { submitPost } from "~/lib/server";

const [element, setElement] = createSignal<JSX.Element>(null);
const closePostModal = () => {
  setElement(null);
};
export const openPostModal = () => {
  console.log("opening");
  setElement(PostModalElement({ closeFn: closePostModal }));
};

const [postBody, setPostBody] = createSignal<string | null>("");

const updatePlaceholder = (e: Event) => {
  const el: HTMLElement = e.target as HTMLElement;
  setPostBody(el.textContent);
  if (el.textContent == "") {
    el.removeChild(el.firstChild!);
  }
};

export default function PostModal() {
  return <>{element()}</>;
}

function PostModalElement(props: { closeFn: () => void }) {
  return (
    <div class="fixed left-0 top-0 w-full h-full bg-faint/40 ">
      <div class="relative top-[5%] mx-auto bg-background rounded-2xl w-[600px] max-h-[90dvh] px-4 pb-2">
        <div class=" py-4">
          <button
            class="text-foreground hover:bg-highlightextra rounded-full aspect-square p-2"
            onclick={closePostModal}
          >
            <div class="h-5 w-5 m-auto">x</div>
          </button>
        </div>
        <form
          method="post"
          action={action((formData: FormData) => {
            closePostModal();
            return submitPost(formData);
          })}
          class=" "
        >
          <div class=" border-b border-solid border-ui flex gap-2 ">
            <div class="pt-3">
              <div class="h-10 w-10 bg-gray-300 rounded-full"></div>
            </div>
            <p
              contentEditable
              onInput={updatePlaceholder}
              class=" [&:empty:not(:focus)]:after:content-['Write_Something'] after:text-faint grow text-xl min-h resize-none text-foreground outline-none bg-background focus-within:placeholder-background "
              id=""
            ></p>
            <textarea name="body" id="" class="hidden">
              {postBody()}
            </textarea>
          </div>
          <div class="flex justify-between">
            <div></div>
            <button
              type="submit"
              class="px-4 py-2 cursor-pointer bg-accent transition hover:bg-accent/90 rounded-full text-white font-bold mt-2"
            >
              <div class="flex items-center justify-center">
                <span class="text-md">Post</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
