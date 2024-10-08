import { action } from '@solidjs/router';
import { createSignal, useContext } from 'solid-js';
import { UserContext } from '~/lib/UserContext';
import UserPfp from '../user/UserPfp';
import CharacterLimit from '../shared/CharacterLimit';
import { submitComment } from '~/lib/server';

const [postBody, setPostBody] = createSignal<string>('');

const updatePlaceholder = (e: Event) => {
  const el: HTMLElement = e.target as HTMLElement;
  setPostBody(el.textContent ?? '');
};

export default function WriteComment(props: {
  parentid: string;
  replyTo: string;
  addComment: (comment: string, id: string) => void;
}) {
  const user = useContext(UserContext);

  return (
    <form
      method="post"
      action={action(async (formData: FormData) => {
        const body = formData.get('body')?.toString();
        if (body === undefined || body.length > 280 || body.length < 1) {
          return;
        }
        const res = await submitComment(formData, props.parentid);
        if (!res) return;
        props.addComment(res.comment, res.id);
      }, 'postcomment')}
      class=" pt-2 "
    >
      <div class="pl-10">
        <p class="text-sm text-faint pl-2.5">
          Replying to <span class=" text-accent">{`@${props.replyTo}`}</span>
        </p>
      </div>
      <div class=" flex gap-2.5 pt-2 items-start">
        <div class="mt-3 max-h-10 w-10 aspect-square rounded-full shrink-0">
          <UserPfp pfp={user ? user()?.pfp : undefined} />
        </div>
        <p
          contentEditable
          onInput={updatePlaceholder}
          class="cursor-text pb-2 pt-5 whitespace-break-spaces break-words overflow-y-auto text-pretty [&:empty:not(:focus)]:after:content-['Write_your_reply'] after:text-faint grow text-xl leading-6 min-h-6 resize-none text-foreground outline-none bg-background focus-within:placeholder-background "
          id=""
        ></p>
        <textarea name="body" id="" class="hidden" maxlength={280}>
          {postBody()}
        </textarea>
      </div>
      <div class="flex gap-2 justify-end items-center pb-5 pt-2 bg-background">
        <CharacterLimit limit={280} color="accent" text={postBody()} />
        <button
          disabled={postBody().length > 280 || postBody().length === 0}
          type="submit"
          class="px-4 py-2 cursor-pointer bg-accent transition hover:bg-accent/90 rounded-full text-white font-bold disabled:opacity-40 "
        >
          <div class="flex items-center justify-center">
            <span class="text-md">Reply</span>
          </div>
        </button>
      </div>
    </form>
  );
}
