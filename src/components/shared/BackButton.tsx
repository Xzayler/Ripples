import { A } from '@solidjs/router';

export default function BackButton(props: { href?: string }) {
  return (
    <A
      href={props.href ?? '/home'}
      class="flex items-center justify-center w-8 aspect-square p-1 rounded-full hover:bg-ui"
    >
      <svg
        fill="currentColor"
        stroke-width="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        style="overflow: visible; color: currentcolor;"
        height="100%"
        width="100%"
      >
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H109.3l105.3-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path>
      </svg>
    </A>
  );
}
