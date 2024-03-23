import { action } from "@solidjs/router";
import { createSignal } from "solid-js";
import { JSX } from "solid-js";
import { submitPost, submitComment } from "~/lib/server";
import { Ripple } from "~/types";

const [element, setElement] = createSignal<JSX.Element>(null);
const closePostModal = () => {
  const html = document.getElementsByTagName("html")[0] as HTMLElement;
  html.classList.remove("overflow-hidden");
  setElement(null);
};
export const openPostModal = () => {
  const html = document.getElementsByTagName("html")[0] as HTMLElement;
  html.classList.add("overflow-hidden");
  setElement(PostModalElement({}));
};

export const openCommentModal = (ripple: Ripple) => {
  const html = document.getElementsByTagName("html")[0] as HTMLElement;
  html.classList.add("overflow-hidden");
  setElement(PostModalElement({ parent: ripple }));
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

function PostModalElement(props: { parent?: Ripple }) {
  return (
    <div class="fixed left-0 top-0 w-full h-full bg-faint/40 ">
      <div class="relative top-[5%] mx-auto bg-background rounded-2xl w-[600px] overflow-hidden ">
        <div class="max-h-[90dvh] overflow-x-auto">
          <div class="py-4 sticky top-0 bg-black bg-opacity-65 backdrop-blur-md">
            <button
              class="text-foreground hover:bg-highlightextra rounded-full aspect-square p-2"
              onclick={closePostModal}
            >
              <div class="h-5 w-5 m-auto">x</div>
            </button>
          </div>
          <div class="px-4">
            {/* Ripple to comment to */}
            {props.parent && (
              <div class="flex gap-3 w-full">
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
                        {/* <span>{`${date.getMonth()} ${date.getDate()}`}</span> */}
                        <span>{props.parent.createdAt.toUTCString()}</span>
                      </div>
                    </div>
                  </div>
                  {/* Post Content */}
                  <div>{props.parent.content}</div>
                  <div class="py-4 text-md text-faint">{`Replying to ${props.parent.authorHandle}`}</div>
                </div>
              </div>
            )}
            <form
              method="post"
              action={action((formData: FormData) => {
                closePostModal();
                if (props.parent) {
                  return submitComment(formData, props.parent.id);
                } else {
                  return submitPost(formData);
                }
              })}
              class=" "
            >
              <div class=" flex gap-2.5 ">
                <div class="pt-3">
                  <div class="h-10 w-10 bg-gray-300 rounded-full"></div>
                </div>
                <p
                  contentEditable
                  onInput={updatePlaceholder}
                  class="mb-4 mt-5 [&:empty:not(:focus)]:after:content-['Write_Something'] after:text-faint grow text-xl leading-6 min-h-14 resize-none text-foreground outline-none bg-background focus-within:placeholder-background "
                  id=""
                ></p>
                <textarea name="body" id="" class="hidden">
                  {postBody()}
                </textarea>
              </div>
              <div class="flex justify-between sticky bottom-0 pb-2 border-t border-solid border-ui bg-background">
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
      </div>
    </div>
  );
}
