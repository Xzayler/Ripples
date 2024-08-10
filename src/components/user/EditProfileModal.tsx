import Modal, {
  openModal as om,
  ModalHeadClose,
  ModalHeadBack,
  ModalFoot,
} from '../shared/Modal';
import {
  Show,
  Switch,
  Match,
  createSignal,
  useContext,
  createResource,
  Suspense,
} from 'solid-js';
import { UserContext } from '~/lib/UserContext';
import { getUserData, updateUserData } from '~/lib/server';
import UserPfp from './UserPfp';
import { action, useAction, useSubmission } from '@solidjs/router';
import CharacterLimit from '../shared/CharacterLimit';

export const openModal = om;

export default function EditProfileModal(props: { closeFn: () => void }) {
  const contextUser = useContext(UserContext);
  const [user] = createResource(
    () => {
      if (contextUser == undefined) return undefined;
      return contextUser();
    },
    (u) => {
      if (u == undefined) return null;
      return getUserData(u.handle);
    },
  );

  const [stage, setStage] = createSignal<'pfp' | 'bio' | 'pending'>('pfp');
  const [pfp, setPfp] = createSignal<File | null>(null);

  const [bio, setBio] = createSignal<string | null>(null);
  const updateBio = (e: Event) => {
    const el: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
    if (el.value.length > 160) {
      el.setCustomValidity('Bio too long');
    } else {
      setBio(el.value ?? '');
    }
  };

  const [name, setName] = createSignal<string | null>(null);
  const updateName = (e: Event) => {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    if (el.value.length == 0) setName(null); // So the name doesn't get changed
    if (!/^[A-Za-z0-9 _-]+$/.test(el.value)) {
      el.setCustomValidity(
        "Use only space or valid characters a-z, A-Z, 0-9, '_' or '-'",
      );
    }
    setName(el.value);
  };

  const submitAction = action(async () => {
    return updateUserData(pfp(), name(), bio());
  });

  const submitChanges = useAction(submitAction);
  const submitRes = useSubmission(submitAction);

  function isValid() {
    if (
      (name() && (!/^[A-Za-z0-9 _-]+$/.test(name()!) || name()!.length > 16)) ||
      (bio() && bio()!.length > 160)
    ) {
      return false;
    } else return true;
  }

  return (
    <Modal>
      <Suspense>
        <Switch>
          {/* Pfp Selection */}
          <Match when={stage() == 'pfp'}>
            <ModalHeadClose closeFn={props.closeFn} />
            <div class="justify-between h-full px-20 flex flex-col">
              <p class="font-bold text-foreground text-3xl mt-5 ">
                Pick a Profile Picture!
              </p>
              <div class=" flex justify-center grow items-center my-4 ">
                <div class="w-48 h-48 max-w-48 max-h-48 relative">
                  <Switch fallback={<UserPfp />}>
                    <Match when={pfp() != null}>
                      <UserPfp pfp={URL.createObjectURL(pfp()!)} />
                    </Match>
                    <Match when={user()?.pfp}>
                      <UserPfp pfp={user()!.pfp!} />
                    </Match>
                  </Switch>
                  <div class="absolute top-0 left-0 w-full h-full rounded-full bg-background/20">
                    <PfpFileUploadLabel fn={setPfp} />
                  </div>
                </div>
              </div>
            </div>
            <div class="px-3">
              <ModalFoot>
                <div class="my-4 w-full px-20">
                  <button
                    type="button"
                    onClick={() => {
                      setStage('bio');
                    }}
                    class=" w-full px-8 group cursor-pointer transition rounded-full border text-foreground border-faint border-solid bg-background hover:bg-foreground/10"
                  >
                    <div class="flex items-center justify-center py-3 text-lg  ">
                      <span class="text-lg font-bold ">Next</span>
                    </div>
                  </button>
                </div>
              </ModalFoot>
            </div>
          </Match>

          {/* Name & bio */}
          <Match when={stage() == 'bio'}>
            <ModalHeadBack
              fn={() => {
                setStage('pfp');
              }}
            />
            <form
              id="namenbio"
              class="justify-between h-full px-20 flex flex-col"
            >
              <p class="font-bold text-foreground text-3xl mt-5 mb-2 ">
                Describe Yourself
              </p>
              <div class="flex flex-col items-stretch ">
                <CharacterLimit text={name()} limit={16} />
                <input
                  type="text"
                  placeholder="Your Name"
                  maxlength={16}
                  onInput={updateName}
                  pattern="^[A-Za-z0-9 _-]+$"
                  class="mt-1 overflow-hidden rounded-lg p-2 outline-offset-0 focus:outline-accent border border-faint text-pretty placeholder:text-faint text-xl leading-6 min-h-10 resize-none text-foreground outline-none bg-background "
                />
              </div>
              <div class="mt-2 mb-4 grow flex flex-col items-stretch ">
                <div class="flex gap-2 items-center">
                  <CharacterLimit text={bio()} limit={160} />
                  <Show when={user()?.bio && user()!.bio!.length > 0}>
                    <button
                      type="button"
                      class="text-md text-foreground hover:underline cursor-pointer"
                      onClick={() => {
                        setBio('');
                      }}
                    >
                      Clear currently saved bio
                    </button>
                  </Show>
                </div>
                <textarea
                  placeholder="Your New Bio"
                  rows={4}
                  maxlength={160}
                  onInput={updateBio}
                  class="mt-1 overflow-auto rounded-lg p-2 outline-offset-0 focus:outline-accent border border-faint text-pretty placeholder:text-faint text-xl leading-6 min-h-14 resize-none text-foreground outline-none bg-background "
                />
              </div>
            </form>
            <div class="px-3">
              <ModalFoot>
                <div class="my-4 w-full px-20">
                  <button
                    type="submit"
                    form="namenbio"
                    onClick={() => {
                      if (!isValid()) {
                        return;
                      }
                      submitChanges();
                      setStage('pending');
                    }}
                    class=" w-full px-8 group cursor-pointer transition rounded-full border text-foreground border-faint border-solid bg-background hover:bg-foreground/10"
                  >
                    <div class="flex items-center justify-center py-3 text-lg  ">
                      <span class="text-lg font-bold ">Save Changes</span>
                    </div>
                  </button>
                </div>
              </ModalFoot>
            </div>
          </Match>

          {/* Submission */}
          <Match when={stage() == 'pending'}>
            <Show
              when={submitRes.result || submitRes.error}
              fallback={<p class="text-xl">Saving...</p>}
            >
              <ModalHeadClose closeFn={props.closeFn} />
              <div class="flex items-center justify-center h-full min-h-48 ">
                <p class="text-xl">
                  {submitRes.result ?? submitRes.error.message}
                </p>
              </div>
            </Show>
          </Match>
        </Switch>
      </Suspense>
    </Modal>
  );
}

function PfpFileUploadLabel(props: { fn: (file: File) => void }) {
  return (
    <label
      for="pfp-file-upload"
      class=" flex items-center justify-center cursor-pointer hover:bg-gray-300/40 absolute h-10 w-10 left-0 right-0 mx-auto top-0 bottom-0 my-auto bg-gray-400/40 rounded-full  border border-red-500"
    >
      <input
        type="file"
        id="pfp-file-upload"
        accept="image/*"
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files![0];
          props.fn(file);
        }}
        class="hidden"
      />
      <span>+</span>
    </label>
  );
}
