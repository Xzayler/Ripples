import { Portal } from 'solid-js/web';
import { createSignal, type JSX } from 'solid-js';
import { Suspense } from 'solid-js';

export default function Tooltip(props: {
  children: JSX.Element;
  pos: { x: number; y: number };
}) {
  return (
    <Portal mount={document.getElementById('modal-root')!}>
      <div
        style={`bottom: calc(100dvh - ${props.pos.y - 8}px); left: ${
          props.pos.x
        }px;`}
        class="absolute -translate-x-1/2  "
      >
        <div class="relative left">
          <Suspense>{props.children}</Suspense>
        </div>
      </div>
    </Portal>
  );
}
