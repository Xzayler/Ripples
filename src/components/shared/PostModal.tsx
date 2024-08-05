import { action, useNavigate, A } from '@solidjs/router';
import { createSignal, Show, useContext } from 'solid-js';
import { submitPost, submitComment } from '~/lib/server';
import { Ripple } from '~/types';
import Modal, { openModal as om, ModalFoot, ModalHeadClose } from './Modal';
import PostContent from '../feed/PostContent';
import CharacterLimit from './CharacterLimit';
import UserPfp from '../user/UserPfp';
import { UserContext } from '~/lib/UserContext';
import { calcDate } from '~/lib/date';

export const openModal = om;

export default function PostModal(props: {
  parent?: Ripple;
  closeFn: () => void;
}) {
  const navigate = useNavigate();
  const [postBody, setPostBody] = createSignal<string>('');

  const updateInput = (e: Event) => {
    const el: HTMLElement = e.target as HTMLElement;
    setPostBody(el.textContent ?? '');
  };

  const user = useContext(UserContext);

  return (
    <Modal>
      <ModalHeadClose closeFn={props.closeFn} />
      <div class="px-4 grow overflow-y-auto whitespace-pre-wrap break-words ">
        <Show when={props.parent}>
          <div class="flex gap-3 w-full">
            <div class="flex gap-1 flex-col items-center basis-10">
              <div class="w-10 aspect-square rounded-full">
                <UserPfp pfp={props.parent!.pfp} />
              </div>
              <div class="grow border-x border-ui border-solid"></div>
            </div>
            <div class="flex text-md flex-col w-full">
              {/* Post Meta */}
              <div class="flex flex-row flex-wrap">
                <div class="mr-1">
                  <span class="font-bold text-foreground">
                    {props.parent!.authorName}
                  </span>
                </div>
                <div class="flex text-faint flex-wrap">
                  <div>
                    <span>{`@${props.parent!.authorHandle}`}</span>
                  </div>
                  <div class="px-1">
                    <span>⋅</span>
                  </div>
                  <div>
                    <time>{calcDate(props.parent!.createdAt)}</time>
                  </div>
                </div>
              </div>
              {/* Post Content */}
              <div class="pt-4">
                <PostContent content={props.parent!.content} />
              </div>
              <div class="py-4 text-md text-faint">
                Replying to{' '}
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
            const body = formData.get('body')?.toString();

            if (props.parent) {
              const res = await submitComment(formData, props.parent.id);
              if (res) {
                navigate(`/post/${res.id}`);
              }
            } else {
              const id = await submitPost(formData);
              if (id) {
                navigate(`/post/${id}`);
              }
            }
            props.closeFn();
          })}
        >
          <div class=" flex gap-2.5 items-start">
            <div class="mt-3 w-10 aspect-square rounded-full shrink-0">
              <UserPfp pfp={user ? user()?.pfp : undefined} />
            </div>
            <p
              contentEditable
              onInput={updateInput}
              class=" overflow-y-auto mb-4 mt-5 text-pretty [&:empty:not(:focus)]:after:content-['Write_Something'] after:text-faint grow text-xl leading-6 min-h-14 resize-none text-foreground outline-none bg-background focus-within:placeholder-background "
              id=""
            ></p>
            <textarea name="body" class="hidden" maxlength={280}>
              {postBody()}
            </textarea>
          </div>
        </form>
      </div>
      <ModalFoot>
        <div class="flex justify-between items-center py-2 bg-background px-4 w-full gap-2 ">
          <div class=" ml-auto text-accent ">
            <CharacterLimit text={postBody()} limit={280} color="accent" />
          </div>
          <button
            disabled={postBody().length > 280 || postBody().length === 0}
            form="postform"
            type="submit"
            class="px-4 py-2 cursor-pointer bg-accent transition hover:bg-accent/90 rounded-full text-white font-bold disabled:opacity-40"
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
