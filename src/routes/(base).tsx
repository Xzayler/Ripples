import Navbar from "~/components/navbar/Navbar";
import MessageBox from "~/components/chat/MessageBox";
import { JSX } from "solid-js";
import PostModal from "~/components/shared/PostModal";
import { UserContext } from "~/lib/UserContext";
import { getCurrentUser } from "~/lib/auth";
import { createAsync } from "@solidjs/router";

export default function BaseLayout(props: { children: JSX.Element }) {
  const user = createAsync(() => getCurrentUser());
  return (
    <div class="relative w-full min-h-screen bg-background text-foreground flex justify-center items-center">
      <div class="flex flex-row relative items-start">
        <div class="sticky top-0 max-h-screen flex justify-end ">
          <Navbar />
        </div>
        <UserContext.Provider value={user}>
          {props.children}
        </UserContext.Provider>
        {/* <div class="absolute bottom-0 right-4">
            <MessageBox />
          </div> */}
      </div>
      <PostModal></PostModal>
    </div>
  );
}
