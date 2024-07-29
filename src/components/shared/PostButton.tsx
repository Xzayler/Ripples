import { createSignal, Show } from 'solid-js';
import PostModal, { openModal } from './PostModal';

export default function PostButton() {
  const [active, setActive] = createSignal<boolean>(false);
  return (
    <>
      <div
        onclick={(e) => {
          openModal(() => setActive(true));
        }}
        class="px-8 cursor-pointer bg-accent transition hover:opacity-90 rounded-full text-white font-bold f"
      >
        <div class="flex items-center justify-center h-[50px]">
          <span class="text-lg">Post</span>
        </div>
      </div>
      <Show when={active()}>
        <PostModal closeFn={() => setActive(false)} />
      </Show>
    </>
  );
}
