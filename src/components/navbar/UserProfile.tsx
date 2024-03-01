import { createAsync } from "@solidjs/router";
import UserProfileMenu from "./UserProfileMenu";
import { createResource } from "solid-js";
import type { User } from "lucia";

export default function UserProfile(props: { user: User | undefined }) {
  return (
    <div class="group">
      <div class="relative w-full">
        <div class=" absolute bottom-0 w-full">
          <UserProfileMenu
            handle={props.user ? props.user!.handle : "NoHandle"}
          />
        </div>
      </div>
      <div
        class="cursor-pointer rounded-full w-full p-3 flex items-center hover:bg-highlight"
        onClick={() => {
          console.log(props.user);
        }}
      >
        <div>
          {/* Image */}
          <div class="bg-gray-400 h-10 w-10 rounded-full"></div>
        </div>
        <div class="flex flex-col mx-3 text-foreground">
          <span class="text-md font-bold ">
            {props.user ? props.user!.name : "No User"}
          </span>
          <span class="text-md text-faint">{`@${
            props.user ? props.user!.handle : "NoHandle"
          }`}</span>
        </div>
        <div class="grow flex justify-end">
          <span class="text-base">⋅⋅⋅</span>
        </div>
      </div>
    </div>
  );
}
