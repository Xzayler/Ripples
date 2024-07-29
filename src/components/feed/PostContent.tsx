import { createResource, For } from 'solid-js';
import { A } from '@solidjs/router';
import { hashtagReg } from '~/lib/postParsing';
import MultiLineText from '../shared/MultiLineText';

export default function PostContent(props: { content: string }) {
  const [res] = createResource(
    () => props.content,
    (content) => {
      const text = props.content.split(hashtagReg);
      const tags: string[] = [];
      for (const match of props.content.matchAll(hashtagReg)) {
        tags.push(match[0]);
      }
      return { text, tags };
    },
  );

  return (
    <>
      <For each={res()?.text}>
        {(item, ind) => {
          return (
            <>
              <MultiLineText text={item} />
              <HashtagLink tag={res()?.tags[ind()]} />
            </>
          );
        }}
      </For>
    </>
  );
}

function HashtagLink(props: { tag: string | undefined }) {
  return (
    <>
      {props.tag ? (
        <A
          class="text-accent hover:underline underline-offset-2"
          href={`/search?searchType=hashtag&q=${props.tag.slice(1)}`}
          onclick={(e) => e.stopPropagation()}
        >
          {props.tag}
        </A>
      ) : null}
    </>
  );
}
