import { createSignal, type JSX, Show, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import UserPopup from "./UserPopup";

export default function UserWrapper(props: {
  handle: string;
  children: JSX.Element;
}) {
  const [timeoutId, setTimeoutId] = createSignal<number>();
  const [active, setActive] = createSignal<boolean>(false);

  let tooltipbox: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined;

  return (
    <div
      class="relative"
      onMouseEnter={() => {
        let timer: number = setTimeout(() => {
          setActive(true);
          (tooltipbox as HTMLElement).classList.add("opacity-100");
        }, 1000) as unknown as number;
        setTimeoutId(timer);
      }}
      onMouseLeave={() => {
        (tooltipbox as HTMLElement).classList.remove("opacity-100");
        setTimeout(() => {
          setActive(false);
        }, 400);
        clearTimeout(timeoutId());
      }}
    >
      <div
        ref={tooltipbox}
        class={"transition duration-200 opacity-0 overflow-visible "}
      >
        <Suspense>
          <Show when={active()}>
            <UserPopup userHandle={props.handle} />
          </Show>
        </Suspense>
      </div>
      <A
        onClick={(e) => {
          e.stopPropagation();
        }}
        href={`/${props.handle}`}
      >
        {props.children}
      </A>
    </div>
  );
}
