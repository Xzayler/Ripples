import { logout } from '~/lib/server';
import { action } from '@solidjs/router';

export default function UserProfileMenu(props: { handle: string }) {
  return (
    <div class=" px-4 py-3 text-md font-bold rounded-4xl bg-background shadow-lg ">
      <form method="post" action={action(logout)}>
        <button>{`Log out @${props.handle}`}</button>
      </form>
    </div>
  );
}
