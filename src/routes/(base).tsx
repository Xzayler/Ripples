import Navbar from "~/components/navbar/Navbar";
import MessageBox from "~/components/chat/MessageBox";
import { JSX, createSignal } from "solid-js";
import PostModal from "~/components/shared/PostModal";
import { UserContext } from "~/lib/UserContext";
import { createAsync } from "@solidjs/router";
import type { User } from "lucia";
import { Suspense } from "solid-js";
import { getCurrentUser } from "~/lib/server";

export default function BaseLayout(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<User>({
    id: "123456",
    name: "Loading",
    handle: "loading",
  } as User);
  const currUser = createAsync(async () => setUser(await getCurrentUser()));
  currUser();
  return (
    <div class="relative w-full min-h-screen bg-background text-foreground flex justify-center items-center">
      <div class="flex flex-row relative items-start">
        <Suspense>
          <UserContext.Provider value={user}>
            <div class="sticky top-0 max-h-screen flex justify-end ">
              <Navbar />
            </div>
            {props.children}
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
