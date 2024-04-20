import { createSignal, type JSX, Show } from "solid-js";
import { render, Portal, Dynamic } from "solid-js/web";
import { mount } from "@solidjs/start/client";
import { A } from "@solidjs/router";
import UserPopup from "./UserPopup";
import { Suspense } from "solid-js";

export default function UserWrapper(props: {
  uId: string;
  handle: string;
  children: JSX.Element;
}) {
  const [element, setElement] = createSignal<JSX.Element>(null);
  const [timeoutId, setTimeoutId] = createSignal<number>();
  const [active, setActive] = createSignal<boolean>(false);

  let tooltipbox: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined;

  const activate = (handle: string) => {
    setElement(() => UserPopup({ userHandle: handle }));
  };

  const deactivate = () => {
    setElement(null);
  };

  // const [dispose, setDispose] = createSignal();

  // const activate = (handle: string) => {
  //   console.log("yo");
  //   const dispose = mount(
  //     () => <div>HELLO</div>,
  //     tooltipbox! as HTMLDivElement
  //   );
  //   console.log(dispose);
  //   setDispose(dispose);
  // };

  // const deactivate = () => {
  //   // @ts-ignore
  //   if (dispose()) dispose()();
  // };

  return (
    <div
      class="relative"
      onMouseEnter={() => {
        // activate(props.handle);
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
      <A href={`/${props.handle}`}>{props.children}</A>
    </div>
  );
}
