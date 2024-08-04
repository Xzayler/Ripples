import { createMemo, For } from 'solid-js';

export default function MultiLineText(props: { text: string }) {
  const lines = createMemo(() => {
    return props.text.split('\n');
  });

  return (
    <For each={lines()}>
      {(item, ind) => {
        return (
          <>
            {item}
            {ind() < lines().length - 1 && <br />}
          </>
        );
      }}
    </For>
  );
}
