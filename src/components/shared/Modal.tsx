import { JSX, Suspense } from "solid-js";
import { Portal } from "solid-js/web";

export const openModal = (openFn: () => void) => {
  const html = document.getElementsByTagName("html")[0] as HTMLElement;
  html.classList.add("overflow-hidden");
  openFn();
};

export const closeModal = (fn: () => void) => {
  (document.getElementsByTagName("html")[0] as HTMLElement).classList.remove(
    "overflow-hidden"
  );
  fn();
};

export default function Modal(props: {
  children: JSX.Element;
  class?: string;
}) {
  return (
    <Portal mount={document.getElementById("modal-root")!}>
      <div class="fixed left-0 top-0 w-full h-full bg-faint/40 z-50 flex justify-center items-start pt-[5vh] ">
        <div
          class={
            " bg-background rounded-2xl w-[600px] overflow-hidden min-w-[600px] max-h-[90vh] max-w-[80vw] " +
            props.class
          }
        >
          <div class=" h-full flex flex-col">
            <Suspense>{props.children}</Suspense>
          </div>
        </div>
      </div>
    </Portal>
  );
}

function ModalHead(props: { fn: () => void; icon: string }) {
  return (
    <div class="px-2 py-2 sticky top-0 bg-black bg-opacity-65 backdrop-blur-md">
      <button
        class="text-foreground hover:bg-highlightextra rounded-full aspect-square p-2 flex items-center justify-center"
        onclick={() => {
          closeModal(props.fn);
        }}
      >
        <div class="h-5 w-5 flex items-center justify-center">{props.icon}</div>
      </button>
    </div>
  );
}

export function ModalHeadBack(props: { fn: () => void }) {
  return <ModalHead fn={props.fn} icon={"<-"} />;
}
export function ModalHeadClose(props: { closeFn: () => void }) {
  return <ModalHead fn={props.closeFn} icon={"X"} />;
}

export function ModalFoot(props: { children: JSX.Element }) {
  return (
    <div class="flex justify-between sticky bottom-0 pb-2 border-t border-solid border-ui bg-background">
      {props.children}
    </div>
  );
}
