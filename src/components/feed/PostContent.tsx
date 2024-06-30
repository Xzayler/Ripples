import { For } from "solid-js";
import { A } from "@solidjs/router";
import { hashtagReg } from "~/lib/postParsing";

export default function PostContent(props: { content: string }) {
  const text = props.content.split(hashtagReg);
  console.log(props.content);
  const tags: string[] = [];
  for (const match of props.content.matchAll(hashtagReg)) {
    tags.push(match[0]);
  }

  // let res = "";
  // for (let i = 0; i < text.length; i++) {
  //   res += `${text[i]}${tags[i] ?? ""}`;
  // }

  return (
    <>
      <For each={text}>
        {(item, ind) => {
          return (
            <>
              {item}
              <HashtagLink tag={tags[ind()]} />
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
        <A class="text-accent hover:underline underline-offset-2 " href="">
          {props.tag}
        </A>
      ) : null}
    </>
  );
}
