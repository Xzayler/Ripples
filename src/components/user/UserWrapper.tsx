import { createSignal, type JSX } from "solid-js";
import UserPopup from "./UserPopup";

export default function UserWrapper(props: {
  handle: string;
  children: JSX.Element;
}) {
  const [element, setElement] = createSignal<JSX.Element>(null);

  const activate = (handle: string) => {
    setElement(UserPopup({ userHandle: handle }));
  };

  const deactivate = () => {
    setElement(null);
  };

  let tooltipbox: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined;

  return (
    <div
      class="relative"
      onMouseEnter={() => {
        activate(props.handle);
        setTimeout(() => {
          (tooltipbox as HTMLElement).classList.add("opacity-100");
        }, 1000);
      }}
      onMouseLeave={() => {
        deactivate();
        (tooltipbox as HTMLElement).classList.remove("opacity-100");
      }}
    >
      <div
        ref={tooltipbox}
        class="transition duration-400 opacity-0 overflow-visible "
      >
        {element()}
      </div>
      <a href={`/${props.handle}`}>{props.children}</a>
    </div>
  );
}
