import Navbar from "~/components/navbar/Navbar";
import MessageBox from "~/components/chat/MessageBox";
import { JSX, Show, createResource } from "solid-js";
import PostModal from "~/components/shared/PostModal";
import { UserContext } from "~/lib/UserContext";
import type { User as LuciaUser } from "lucia";
import { Suspense } from "solid-js";
import { getCurrentUser } from "~/lib/gcu";
import WavesIcon from "~/components/shared/icons/WavesIcon";

export default function BaseLayout(props: { children: JSX.Element }) {
  const [user] = createResource(async () => {
    return (await getCurrentUser()) as LuciaUser;
  });

  return (
    <div class="relative w-full min-h-screen bg-background text-foreground flex justify-center items-center">
      <div class="flex flex-row relative items-start justify-center">
        <Suspense
          fallback={
            <div class="w-full h-dvh bg-background flex items-center justify-center  ">
              <WavesIcon />
            </div>
          }
        >
          <Show when={user()} fallback={<div>Loadin...</div>}>
            <UserContext.Provider value={user}>
              <div class="sticky top-0 max-h-screen flex justify-end ">
                <Navbar />
              </div>
              <Suspense
                fallback={
                  <div class="w-full h-dvh bg-background flex items-center justify-center  ">
                    <WavesIcon />
                  </div>
                }
              >
                {props.children}
              </Suspense>
              <div id="modal-root" class="h-0 w-0"></div>
            </UserContext.Provider>
          </Show>
        </Suspense>
        {/* <div class="absolute bottom-0 right-4">
            <MessageBox />
          </div> */}
      </div>
      <PostModal></PostModal>
    </div>
  );
}
