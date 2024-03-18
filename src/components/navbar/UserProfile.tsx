import UserProfileMenu from "./UserProfileMenu";
import { useContext } from "solid-js";
import { UserContext } from "~/lib/UserContext";

export default function UserProfile() {
  const user = useContext(UserContext);
  return (
    <div class="group">
      <div class="relative w-full">
        <div class=" absolute bottom-0 w-full">
          <UserProfileMenu handle={user!() ? user!().handle : "loading"} />
        </div>
      </div>
      <div class="cursor-pointer rounded-full w-full p-3 flex items-center hover:bg-highlight">
        <div>
          {/* Image */}
          <div class="bg-gray-400 h-10 w-10 rounded-full"></div>
        </div>
        <div class="flex flex-col mx-3 text-foreground">
          <span class="text-md font-bold ">
            {user!() ? user!().name : "Loading"}
          </span>
          <span class="text-md text-faint">{`@${
            user!() ? user!().handle : "loading"
          }`}</span>
        </div>
        <div class="grow flex justify-end">
          <span class="text-base">⋅⋅⋅</span>
        </div>
      </div>
    </div>
  );
}
