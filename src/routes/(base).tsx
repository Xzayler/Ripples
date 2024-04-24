import Navbar from "~/components/navbar/Navbar";
import MessageBox from "~/components/chat/MessageBox";
import { JSX, createResource } from "solid-js";
import PostModal from "~/components/shared/PostModal";
import { UserContext } from "~/lib/UserContext";
import type { User as LuciaUser } from "lucia";
import { Suspense } from "solid-js";
import { getCurrentUser } from "~/lib/server";
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
          </UserContext.Provider>
        </Suspense>
        {/* <div class="absolute bottom-0 right-4">
            <MessageBox />
          </div> */}
      </div>
      <PostModal></PostModal>
    </div>
  );
}
