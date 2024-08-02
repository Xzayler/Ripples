import { A } from '@solidjs/router';
import { JSX } from 'solid-js';

export default function MenuItem(props: {
  text: string;
  href: string;
  children: JSX.Element;
  extraClass?: string;
}) {
  return (
    <A
      href={props.href}
      class={
        'p-3 rounded-full hover:bg-highlight transiton ' + props.extraClass
      }
    >
      <div class="flex h-8 w-auto">
        <div class="shrink-0 w-8 h-full">{props.children}</div>
        <div class="ml-5 mr-4 items-center justify-center hidden @[259px]/nav:block ">
          <span class="block text-xl font-semibold">{props.text}</span>
        </div>
      </div>
    </A>
  );
}

export function MenuItemNoA(props: {
  text: string;
  children: JSX.Element;
  extraClass?: string;
}) {
  return (
    <div
      class={
        'p-3 rounded-full hover:bg-highlight transiton ' + props.extraClass
      }
    >
      <div class="flex h-8 w-auto">
        <div class="shrink-0 w-8 h-full">{props.children}</div>
        <div class="ml-5 mr-4 items-center justify-center hidden @[259px]/nav:block ">
          <span class="block text-xl font-semibold">{props.text}</span>
        </div>
      </div>
    </div>
  );
}
