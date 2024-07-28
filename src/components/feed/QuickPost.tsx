import { createSignal, Show, useContext } from "solid-js";
import PostModal, { openModal } from "../shared/PostModal";
import UserPfp from "../user/UserPfp";
import { UserContext } from "~/lib/UserContext";

export default function QuickPost() {
  const [active, setActive] = createSignal<boolean>(false);
  const user = useContext(UserContext);
  return (
    <>
      <div
        onclick={() => openModal(() => setActive(true))}
        class="px-4 py-3 flex cursor-pointer"
      >
        <div class="h-10 aspect-square">
          <UserPfp pfp={user!() ? user!()!.pfp : undefined} />
        </div>
        <div class="flex w-full gap-3 items-center justify-normal">
          <div class="flex py-2 px-3 ml-3 grow shrink border-ui border rounded-full">
            <span class="text-faint">What is happening!?</span>
          </div>
          {/* svg placeholders */}
          <div class="h-6 w-6 bg-ui rounded-md "></div>
          <div class="h-6 w-6 bg-ui rounded-md "></div>
          <div class="h-6 w-6 bg-ui rounded-md "></div>
        </div>
      </div>
      <Show when={active()}>
        <PostModal closeFn={() => setActive(false)} />
      </Show>
    </>
  );
}
