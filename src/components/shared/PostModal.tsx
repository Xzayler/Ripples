import { action, useNavigate, A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { submitPost, submitComment } from "~/lib/server";
import { Ripple } from "~/types";
import Modal, { openModal as om, ModalFoot, ModalHeadClose } from "./Modal";
import PostContent from "../feed/PostContent";
import CharacterLimit from "./CharacterLimit";

export const openModal = om;

export default function PostModal(props: {
  parent?: Ripple;
  closeFn: () => void;
}) {
  const navigate = useNavigate();
  const [postBody, setPostBody] = createSignal<string | null>("");

  const updateInput = (e: Event) => {
    const el: HTMLElement = e.target as HTMLElement;
    setPostBody(el.textContent);
    if (el.textContent == "" && el.firstChild) {
      el.removeChild(el.firstChild);
    }
  };

  return (
    <Modal>
      <ModalHeadClose closeFn={props.closeFn} />
      <div class="px-4 grow overflow-y-auto whitespace-pre-wrap break-words ">
        <Show when={props.parent}>
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
                    {props.parent!.authorName}
                  </span>
                </div>
                <div class="flex text-faint">
                  <div>
                    <span>{`@${props.parent!.authorHandle}`}</span>
                  </div>
                  <div class="px-1">
                    <span>⋅</span>
                  </div>
                  <div>
                    <span>{props.parent!.createdAt.toUTCString()}</span>
                  </div>
                </div>
              </div>
              {/* Post Content */}
              <div class="pt-4">
                <PostContent content={props.parent!.content} />
              </div>
              <div class="py-4 text-md text-faint">
                Replying to{" "}
                <A class="text-accent" href={`/${props.parent!.authorHandle}`}>
                  {`@${props.parent!.authorHandle}`}
                </A>
              </div>
            </div>
          </div>
        </Show>
        <form
          id="postform"
          method="post"
          action={action(async (formData: FormData) => {
            if (props.parent) {
              navigate(
                `/post/${(await submitComment(formData, props.parent.id)).id}`
              );
            } else {
              navigate(`/post/${await submitPost(formData)}`);
            }
            props.closeFn();
          })}
        >
          <div class=" flex gap-2.5 ">
            <div class="pt-3">
              <div class="h-10 w-10 bg-gray-300 rounded-full"></div>
            </div>
            <p
              contentEditable
              onInput={updateInput}
              class=" overflow-y-auto mb-4 mt-5 w-[32.375rem] text-pretty [&:empty:not(:focus)]:after:content-['Write_Something'] after:text-faint grow text-xl leading-6 min-h-14 resize-none text-foreground outline-none bg-background focus-within:placeholder-background "
              id=""
            ></p>
            <textarea name="body" class="hidden">
              {postBody()}
            </textarea>
          </div>
        </form>
      </div>
      <ModalFoot>
        <div class="flex justify-between items-center py-2 bg-background px-4 w-full gap-2 ">
          <div class=" ml-auto text-accent " >
            <CharacterLimit text={postBody()} limit={280} color="accent"/>
          </div>
          <button
            form="postform"
            type="submit"
            class="px-4 py-2 cursor-pointer bg-accent transition hover:bg-accent/90 rounded-full text-white font-bold"
          >
            <div class="flex items-center justify-center">
              <span class="text-md">Post</span>
            </div>
          </button>
        </div>
      </ModalFoot>
    </Modal>
  );
}
