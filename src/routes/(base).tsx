import Navbar from "~/components/navbar/Navbar";
import MessageBox from "~/components/chat/MessageBox";
import {
  JSX,
  children,
  createContext,
  createEffect,
  createResource,
  createSignal,
  useContext,
} from "solid-js";
import { redirect, cache } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getCurrentUser } from "~/lib/auth";
import type { User } from "lucia";

export default function BaseLayout(props: { children: JSX.Element }) {
  return (
    <div class="relative w-full min-h-screen bg-background text-foreground flex justify-center items-center">
      <div class="flex flex-row relative items-start">
        <div class="sticky top-0 max-h-screen flex justify-end ">
          <Navbar />
        </div>
        {props.children}
        {/* <div class="absolute bottom-0 right-4">
            <MessageBox />
          </div> */}
      </div>
    </div>
  );
}
