import { A } from "@solidjs/router";

export default function BackButton(props: { href?: string }) {
  return (
    <A
      href={props.href ?? "/home"}
      class=" flex items-center justify-center w-8 aspect-square p-1 rounded-full hover:bg-ui "
    >
      {"<-"}
    </A>
  );
}
