import { A, useSubmission } from "@solidjs/router";
import { action } from "@solidjs/router";
import { register } from "~/lib/server";

export default function Signup() {
  const registerResponse = useSubmission(action(register));

  return (
    <div class="min-h-screen flex flex-col justify-center items-center">
      <p>{registerResponse.result?.message}</p>
      <form
        class="mt-5 w-full max-w-lg mx-auto flex flex-col"
        method="post"
        action={action(register)}
      >
        <input
          class="p-3.5 rounded-t border-b border-gray-300 text-gray-900 outline-none"
          name="name"
          type="text"
          placeholder="Name"
          required
          minLength={3}
          maxLength={16}
        />
        <input
          class="p-3.5 border-b border-gray-300 text-gray-900 outline-none"
          name="username"
          type="text"
          placeholder="Username"
          required
          minLength={3}
          maxLength={16}
        />
        <input
          class="p-3.5 border-b border-gray-300 text-gray-900 outline-none"
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={6}
          maxLength={32}
        />
        <input
          class="p-3.5 rounded-b border-gray-300 text-gray-900 outline-none"
          name="confirm-password"
          type="password"
          placeholder="Confirm Password"
          required
          minLength={6}
          maxLength={32}
        />
        <button class="mt-2.5 py-2.5 rounded bg-blue-500 hover:bg-blue-600">
          Sign up
        </button>
      </form>
      <div class="mt-5">
        Already have an account?
        <A class="text-blue-400 ml-1" href="/login">
          Log in here
        </A>
      </div>
    </div>
  );
}
