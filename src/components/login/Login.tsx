import { A, redirect, action, useAction } from "@solidjs/router";
import { login } from "~/lib/server";
import { getRequestEvent } from "solid-js/web";

const isLoggedIn = action(async () => {
  "use server";
  const event = getRequestEvent();
  if (event?.locals.session) {
    throw redirect("/home");
  }
}, "user");

export default function Login() {
  const checkLoggedIn = useAction(isLoggedIn);
  checkLoggedIn();

  return (
    <div class="min-h-screen flex flex-col justify-center items-center">
      {/* TODO: Show an error if username or password is incorrect */}
      {/* useSubmission(login) */}
      <form
        action={action(login)}
        method="post"
        class="mt-5 w-full max-w-lg mx-auto flex flex-col"
      >
        <input
          class="p-3.5 rounded-t border-b border-gray-300 text-gray-900 outline-none"
          name="username"
          type="text"
          placeholder="Username"
          required
        />
        <input
          class="p-3.5 rounded-b text-gray-900 outline-none"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button class="mt-2.5 py-2.5 rounded bg-blue-500 hover:bg-blue-600">
          Log in
        </button>
      </form>
      <div class="mt-5">
        Don't have an account?
        <A class="text-blue-400 ml-1" href="/signup">
          Sign up here
        </A>
      </div>
    </div>
  );
}
