import { A } from '@solidjs/router';
import { Title } from '@solidjs/meta';
import WavesIcon from '~/components/shared/icons/WavesIcon';
import GithubIcon from '~/components/shared/icons/GithubIcon';
import {
  createContext,
  createSignal,
  JSXElement,
  Show,
  useContext,
} from 'solid-js';
// @ts-ignore
import desktopScreenshot from '../assets/desktop.png';
// @ts-ignore
import mobileScreenshot from '../assets/mobile.png';
import { dbReset } from '~/lib/server';

export default function MainPage() {
  const [clicked, setClicked] = createSignal<boolean>(false);

  return (
    <>
      <Title>Waves</Title>
      <header class="bg-background/60 px-3 py-2 shadow-foreground shadow-sm sticky top-0 backdrop-blur z-50 ">
        <div class="flex flex-wrap mx-auto gap-3 gap-y-0 justify-end items-center px-1 max-w-6xl">
          <p class="text-foreground text-sm md:text-md">
            {clicked()
              ? 'Database has been reset'
              : 'Please click this if you see any inappropriate content within the app'}
          </p>
          <button
            onclick={() => {
              setClicked(true);
              dbReset();
            }}
            class="text-background text-xs min-w-max md:text-md px-2 py-1 rounded-xl bg-foreground"
          >
            Reset db
          </button>
          {/* <div class="w-8 h-auto text-foreground">
            <LinkedinIcon />
          </div> */}
        </div>
      </header>
      <main class="bg-background text-foreground pb-20">
        <section class="w-full max-w-6xl mx-auto flex flex-wrap-reverse p-4 items-stretch mt-4 min-[640px]:mt-10">
          <div class=" w-min min-w-72 grow flex flex-col gap-4 mt-20 min-[640px]:mt-0 ">
            <div class="flex items-center gap-4 justify-center px-4">
              <div class="h-10 w-auto">
                <WavesIcon />
              </div>
              <h1 class="text-4xl text-foreground">RIPPLES</h1>
            </div>
            <div class="flex items-center flex-col gap-4 justify-center px-4">
              <p class="text-lg text-justify">
                Ripples is a simple feature clone of X (or twitter). Users can
                create an account, post, comment, bookmark and like posts,
                follow other users, use hashtags as well as search for users and
                hashtags.
              </p>
              <div class="flex gap-4 flex-wrap">
                <A
                  class="flex gap-2 rounded bg-foreground text-background px-3 py-2 text-lg items-center min-w-max"
                  href="https://github.com/Xzayler/Ripples"
                  target="_blank"
                >
                  <div class="inline-block max-w-8 h-auto">
                    <GithubIcon />
                  </div>
                  <span>Check the Repo</span>
                </A>
                <A
                  class="flex px-3 py-2 rounded bg-foreground text-background text-lg items-center min-w-max"
                  href="/login"
                >
                  Try It Out
                </A>
              </div>
            </div>
          </div>
          <div class="self-stretch min-w-52 basis-80 flex flex-col grow">
            <div class="grow"></div>
            <div class="relative w-full">
              <div class="border border-ui w-full h-auto">
                <img class="w-full h-full" src={desktopScreenshot} alt="" />
              </div>
              <div class="absolute -bottom-[20%] right-[5%] border border-ui h-4/5 shadow-[0px_0px_3px_0px] shadow-foreground rounded-md overflow-hidden">
                <img class="w-full h-full" src={mobileScreenshot} alt="" />
              </div>
            </div>
            <div class="grow-[2]"></div>
          </div>
        </section>
        <div class="border-b border-ui w-4/5 mx-auto my-20"></div>
        <section class="mx-auto text-foreground flex flex-col items-center px-2">
          <h2 class="text-2xl font-bold mb-6">Techs used</h2>
          <div class="p-4 rounded-lg bg-highlight max-w-3xl w-full ">
            <Tabs>
              <TabMenu>
                <TabHead value="solidjs">SolidJS</TabHead>
                <TabHead value="solidstart">SolidStart</TabHead>
                <TabHead value="Tailwind">Tailwind</TabHead>
                <TabHead value="MongoDB">MongoDB</TabHead>
              </TabMenu>
              <TabBody value="solidjs">
                <p>
                  I decided to use SolidJS for its ability to easily update only
                  the elements that need updating, providing various functional
                  components such as <code>For</code> and <code>Show</code>, and
                  to explore some less-known frameworks.
                  <br />I found its approach focusing on simplicity and
                  efficiency made a lot of sense and, after getting the hang of
                  the basics, it was good to work with.
                </p>
              </TabBody>
              <TabBody value="solidstart">
                <p>
                  SolidStart allowed me to easily build a cohesive full-stack
                  appication with SolidJS, with a lot of things working
                  out-of-the-box, such as SSR and routing.
                  <br />I particularly liked how easy it was to insert
                  server-only functions anywhere I wanted and have them run
                  whenever.
                  <br />
                  It requires some getting used to, especially for beginners, as
                  functions can behave differently depending on wether they run
                  on the client or the server.
                </p>
              </TabBody>
              <TabBody value="Tailwind">
                <p>
                  Using TailwindCSS is always a treat when working with a
                  component-based framework. Being able to immediately see in
                  the html what kind of styles are applied to an element, as
                  well as all the additional features such as normalization and
                  automatic application of vendor prefixes.
                </p>
              </TabBody>
              <TabBody value="MongoDB">
                <p>
                  Deciding to use MongoDB was probably a mistake. The ease of
                  setup through MongoDB Atlas was a big plus and I also haven't
                  tried document-based dbs before so it wasn't all bad, but I
                  ended up trying to shore up features that were supposed to be
                  MongoDB's strengths, like its flexibility.
                  <br />I found myself writing very long aggregation queries
                  over and over, which could have been replaced with simpler and
                  shorter SQL queries. Granted, I could have stored reusable
                  aggregation stages into variables which would have made the
                  code shorter and clearer.
                </p>
              </TabBody>
            </Tabs>
          </div>
        </section>
        <div class="border-b border-ui w-4/5 mx-auto my-20"></div>
        <section class="mx-auto text-foreground flex flex-col items-center px-2">
          <h2 class="text-2xl font-bold mb-6">
            The Good, the Bad and the Ugly
          </h2>
          <div class="p-4 rounded-lg bg-highlight max-w-3xl w-full ">
            <h3 class="text-xl font-bold">The Good</h3>
            <div class="border-b border-ui my-2"></div>
            <p>
              The goal of this project was to get a taste of creating a
              full-stack app, without having to come up with features and think
              about ui design too much.
              <br />I mostly learned about what <em>not</em> to do, and what to
              think about right at the start, like how I'll treat re
            </p>
            <h3 class="text-xl font-bold mt-4">The Bad</h3>
            <div class="border-b border-ui my-2"></div>
            <p>
              I couldn't plan the structure of the app too much, as I didn't
              really know what to expect. One big thing I believe is done
              particularly badly is error and response handling. Throughout the
              majority of the app, the code expects everything to always go
              right and might even crash the client.
            </p>
            <h3 class="text-xl font-bold mt-4">The Ugly</h3>
            <div class="border-b border-ui my-2"></div>
            <p>
              There are some inconsistencies, for example some functions that
              serve similar purposes (like fetching data from the database) have
              different kinds of reponses, making interpreting the code that
              much more difficult unecessarily.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

import type { Accessor, Setter } from 'solid-js';

const TabsContext = createContext<{
  activeTab: Accessor<string>;
  setActiveTab: Setter<string>;
}>();
function useTabsContext() {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error(
      'useTabsContext should only be used within a TabsContext.Provider',
    );
  }
  return context;
}

function Tabs(props: { children: JSXElement }) {
  const [activeTab, setActiveTab] = createSignal<string>('');

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div class="w-full flex flex-col">{props.children}</div>
    </TabsContext.Provider>
  );
}

function TabMenu(props: { children: JSXElement }) {
  return (
    <div class="flex flex-wrap w-full justify-center gap-y-2 border-b-2 border-ui">
      {props.children}
    </div>
  );
}

function TabHead(props: { children: JSXElement; value: string }) {
  const context = useTabsContext();

  // Automatically set the first tab as active
  if (context.activeTab().length === 0) context.setActiveTab(props.value);

  return (
    <button
      onClick={() => context.setActiveTab(props.value)}
      class={
        'flex items-center grow -mb-0.5 justify-center px-4 py-2 text-base hover:bg-faint border-b-2' +
        (context.activeTab() == props.value
          ? ' border-accent'
          : ' border-transparent')
      }
    >
      {props.children}
    </button>
  );
}
function TabBody(props: { children: JSXElement; value: string }) {
  const context = useTabsContext();
  return (
    <Show when={context.activeTab() == props.value}>
      <div class="p-4">{props.children}</div>
    </Show>
  );
}

//
