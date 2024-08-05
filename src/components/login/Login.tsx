import { A, action, useAction, useSubmission } from '@solidjs/router';
import { login, guestLogin } from '~/lib/server';
import { getRequestEvent } from 'solid-js/web';
import { Switch, Match } from 'solid-js';
import { Navigate } from '@solidjs/router';
import Loading from '../shared/Loading';

const isLoggedIn = action(async () => {
  'use server';
  const event = getRequestEvent();
  if (event?.locals.session) {
    return 'home';
  } else {
    return 'login';
  }
}, 'user');

export default function Login() {
  const checkLoggedIn = useAction(isLoggedIn);
  const checkLoggedInResp = useSubmission(isLoggedIn);
  checkLoggedIn();

  const loginAction = action(login);
  const loginSubmission = useSubmission(loginAction);

  return (
    <Switch fallback={<Loading />}>
      <Match
        when={!checkLoggedInResp.pending && checkLoggedInResp.result == 'home'}
      >
        <Navigate href={'/home'} />
      </Match>
      <Match
        when={!checkLoggedInResp.pending && checkLoggedInResp.result == 'login'}
      >
        <div class="h-full flex flex-col justify-center items-center">
          <div class="text-foreground h-6">
            {loginSubmission.pending
              ? ''
              : loginSubmission.error?.message ?? ''}
          </div>
          <form
            action={loginAction}
            method="post"
            class="mt-5 w-full max-w-lg mx-auto flex flex-col"
          >
            <input
              class="p-3.5 bg-background rounded-t border border-ui text-foreground outline-none"
              name="username"
              type="text"
              placeholder="Username"
              required
            />
            <input
              class="p-3.5 bg-background rounded-b border border-ui text-foreground outline-none"
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              class="mt-2.5 py-2.5 text-white font-bold rounded bg-accent hover:opacity-90"
            >
              Log in
            </button>
          </form>
          <div class="mt-5 text-foreground">
            Don't have an account?
            <A class="text-accent ml-1 inline-block" href="/signup">
              Sign up here
            </A>
          </div>
          <p class="text-foreground">or</p>
          <form method="post" action={action(guestLogin)}>
            <button
              type="submit"
              class="mt-2.5 px-2 py-2.5 text-foreground bg-background border-2 border-foreground rounded cursor-pointer"
            >
              Log in as a guest
            </button>
          </form>
        </div>
      </Match>
    </Switch>
  );
}
