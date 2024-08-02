import { createSignal, Show } from 'solid-js';
import PostModal, { openModal } from './PostModal';
import DropIcon from './icons/DropIcon';

export default function PostButton() {
  const [active, setActive] = createSignal<boolean>(false);
  return (
    <>
      <div
        onclick={(e) => {
          openModal(() => setActive(true));
        }}
        class="cursor-pointer bg-accent transition hover:opacity-90 rounded-full text-white font-bold"
      >
        <div class="flex items-center justify-center h-[50px] min-w-[50px] ">
          <span class="text-lg hidden @[259px]/nav:inline px-8">Post</span>
          <span class=" p-3 inline @[259px]/nav:hidden">
            <DropIcon />
          </span>
        </div>
      </div>
      <Show when={active()}>
        <PostModal closeFn={() => setActive(false)} />
      </Show>
    </>
  );
}
