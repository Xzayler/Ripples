import Navbar from '~/components/navbar/Navbar';
// import MessageBox from '~/components/chat/MessageBox';
import { JSX, Show, createResource, createSignal } from 'solid-js';
import { UserContext } from '~/lib/UserContext';
import { Suspense } from 'solid-js';
import { getCurrentUser } from '~/lib/gcu';
import WavesIcon from '~/components/shared/icons/WavesIcon';
import Sidebar from '~/components/sidebar/Sidebar';

export default function BaseLayout(props: { children: JSX.Element }) {
  const [user] = createResource(async () => {
    return await getCurrentUser();
  });

  const [menuOpen, setMenuOpen] = createSignal<boolean>(false);
  function toggleMenu() {
    setMenuOpen(!menuOpen());
  }

  return (
    <Suspense
      fallback={
        <div class="w-full h-dvh bg-background flex items-center justify-center  ">
          <WavesIcon />
        </div>
      }
    >
      <Show when={user()}>
        <UserContext.Provider value={user}>
          <div class="relative max-w-[100dvw] flex justify-center bg-background text-foreground @container/content">
            <div class="flex gap-2 shrink grow @[51rem]/content:grow-0">
              <div class="grow w-1 @[51rem]/content:w-[700px] @[62rem]/content:w-[600px] border-x border-ui">
                <Suspense>
                  <main class="text-base ">{props.children}</main>
                </Suspense>
              </div>
              <div class="min-w-[290px] @[66rem]/content:min-w-[350px] h-min @container/side @[62rem]/content:block hidden">
                <Sidebar />
              </div>
            </div>
            <div class="w-0 z-20 order-first @[31.25rem]/content:order-first @[31.25rem]/content:min-w-[84px] @[79rem]/content:w-full max-w-[275px] h-min sticky top-0 @container/nav">
              <div
                class={`transition bg-opacity-25 fixed top-0 left-0 @[31.25rem]/content:hidden ${
                  menuOpen() ? 'w-dvw h-dvh bg-faint' : ''
                }`}
                onClick={toggleMenu}
              >
                <div class="fixed top-3 left-3 bg-ui rounded-full p-2 flex items-center justify-center">
                  <div class="flex flex-col justify-between h-4">
                    <div class="border-t-2 w-4"></div>
                    <div class="border-t-2 w-4"></div>
                    <div class="border-t-2 w-4"></div>
                  </div>
                </div>
              </div>
              <div class="relative z-50 ">
                <Navbar isOpen={menuOpen()} />
              </div>
            </div>
          </div>
          <div class="h-0 w-0" id="modal-root"></div>
        </UserContext.Provider>
      </Show>
    </Suspense>
  );
}
