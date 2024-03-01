import { A } from "@solidjs/router";
import { logout } from "~/lib/auth";

export default function UserProfileMenu(props: { handle: string }) {
  return (
    <div class=" px-4 py-3 text-md font-bold rounded-4xl bg-background shadow-lg ">
      <form method="post" action={logout}>
        <button>{`Log out @${props.handle}`}</button>
      </form>
    </div>
  );
}
