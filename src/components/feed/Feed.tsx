import Ripple from './Ripple';
import { type Ripple as RippleType } from '~/types';
import { createResource, For, Suspense } from 'solid-js';
import { RippleSkeleton } from './Ripple';

type RippleFetcherWithArg<T> = (t: T) => Promise<RippleType[]>;
type RippleFetcherWithoutArg = () => Promise<RippleType[]>;

export default function Feed<T>(props: {
  fetcher: RippleFetcherWithArg<T> | RippleFetcherWithoutArg;
  arg?: T;
}) {
  const [posts] = createResource(
    () => {
      return { f: props.fetcher, arg: props.arg };
    },
    async ({ f, arg }) => {
      return (
        arg ? await f(arg) : await (f as RippleFetcherWithoutArg)()
      ) as RippleType[];
    },
  );

  return (
    <Suspense
      fallback={
        <>
          <RippleSkeleton />
          <RippleSkeleton />
        </>
      }
    >
      <div class="">
        <For
          each={posts()}
          fallback={<div class="text-center text-xl mt-6">No posts found</div>}
        >
          {(item) => {
            return <Ripple post={item} />;
          }}
        </For>
      </div>
    </Suspense>
  );
}
