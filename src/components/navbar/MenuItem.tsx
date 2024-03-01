import { A } from "@solidjs/router";
import { JSX } from "solid-js";

export default function MenuItem({
  text,
  href,
  children,
}: {
  text: string;
  href: string;
  children: JSX.Element;
}) {
  return (
    <A href={href} class="p-3 rounded-full hover:bg-highlight transiton">
      <div class="flex">
        {children}
        <div class="ml-5 mr-4 flex items-center justify-center">
          <span class="block text-xl font-semibold">{text}</span>
        </div>
      </div>
    </A>
  );
}
