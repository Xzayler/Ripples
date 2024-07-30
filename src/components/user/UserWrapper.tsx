import { createSignal, type JSX, Show, Suspense } from 'solid-js';
import { A } from '@solidjs/router';
import UserPopup from './UserPopup';

export default function UserWrapper(props: {
  handle: string;
  children: JSX.Element;
}) {
  const [timeoutId, setTimeoutId] = createSignal<number>();
  const [active, setActive] = createSignal<boolean>(false);

  let wrapperEl: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined;

  // let eldiv: HTMLDivElement;

  return (
    <div
      ref={wrapperEl}
      class="relative"
      onMouseEnter={(event: MouseEvent) => {
        let timer: number = setTimeout(() => {
          setActive(true);
        }, 1000) as unknown as number;
        setTimeoutId(timer);
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          setActive(false);
        }, 400);
        clearTimeout(timeoutId());
      }}
    >
      <Suspense>
        <Show when={active()}>
          <UserPopup
            userHandle={props.handle}
            pos={(() => {
              const rect = (
                wrapperEl as HTMLDivElement
              ).getBoundingClientRect();
              return {
                x: Math.round(rect.left + (rect.right - rect.left) / 2),
                y: Math.round(rect.top - (rect.bottom - rect.top)),
              };
            })()}
          />
        </Show>
      </Suspense>
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
