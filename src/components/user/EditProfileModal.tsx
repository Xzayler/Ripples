import Modal, {
  openModal as om,
  ModalHeadClose,
  ModalHeadBack,
  ModalFoot,
} from "../shared/Modal";
import {
  Show,
  Switch,
  Match,
  createSignal,
  useContext,
  createResource,
  Suspense,
} from "solid-js";
//@ts-ignore
import defaultPfp from "~/assets/pfps/defaultPfp.png";
import { UserContext } from "~/lib/UserContext";
import { getUserData, updateUserData } from "~/lib/server";
import UserPfp from "./UserPfp";
import { action, useAction, useSubmission } from "@solidjs/router";

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
    }
  );

  const [stage, setStage] = createSignal<"pfp" | "bio" | "pending">("pfp");
  const [pfp, setPfp] = createSignal<File | null>(null);

  const [bio, setBio] = createSignal<string | null>(null);
  const updateBio = (e: Event) => {
    const el: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
    setBio(el.value ?? "");
    console.log(bio());
    // if (el.innerText == "" && el.firstChild) {
    //   el.removeChild(el.firstChild!);
    // }
  };

  const [name, setName] = createSignal<string | null>(null);
  const updateName = (e: Event) => {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    setName(el.value);
    console.log(name());
  };

  const submitAction = action(async () => {
    return updateUserData(pfp(), name(), bio());
  });

  const submitChanges = useAction(submitAction);
  const submitRes = useSubmission(submitAction);

  return (
    <Modal>
      <Suspense>
        <Switch>
          {/* Pfp Selection */}
          <Match when={stage() == "pfp"}>
            <ModalHeadClose closeFn={props.closeFn} />
            <div class="justify-between h-full px-20 flex flex-col">
              <p class="font-bold text-foreground text-3xl mt-5 ">
                Pick a Profile Picture!
              </p>
              <div class=" flex justify-center grow items-center ">
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
                      setStage("bio");
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
          <Match when={stage() == "bio"}>
            <ModalHeadBack
              fn={() => {
                setStage("pfp");
              }}
            />
            <div class="justify-between h-full px-20 flex flex-col">
              <p class="font-bold text-foreground text-3xl mt-5 mb-2 ">
                Describe Yourself
              </p>
              <div class="flex flex-col items-stretch ">
                <p
                  class={
                    name() && name()!.length > 16
                      ? "text-red-500"
                      : "text-faint"
                  }
                >{`${name()?.length ?? 0}/16${
                  name() && name()!.length > 16 ? " Name too long" : ""
                }`}</p>
                <input
                  type="text"
                  placeholder="Your Name"
                  onInput={updateName}
                  class="mt-1 overflow-hidden rounded-lg p-2 outline-offset-0 focus:outline-accent border border-faint text-pretty placeholder:text-faint text-xl leading-6 min-h-10 resize-none text-foreground outline-none bg-background "
                />
              </div>
              <div class="mt-2 mb-4 grow flex flex-col items-stretch ">
                <p
                  class={
                    bio() && bio()!.length > 160 ? "text-red-500" : "text-faint"
                  }
                >{`${bio()?.length ?? 0}/160${
                  bio() && bio()!.length > 160 ? " Bio too long" : ""
                }`}</p>
                <textarea
                  placeholder="Your Bio"
                  rows={4}
                  onInput={updateBio}
                  class="mt-1 overflow-auto rounded-lg p-2 outline-offset-0 focus:outline-accent border border-faint text-pretty placeholder:text-faint text-xl leading-6 min-h-14 resize-none text-foreground outline-none bg-background "
                />
              </div>
            </div>
            <div class="px-3">
              <ModalFoot>
                <div class="my-4 w-full px-20">
                  <button
                    type="button"
                    onClick={() => {
                      submitChanges();
                      setStage("pending");
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
          <Match when={stage() == "pending"}>
            <Show
              when={submitRes.result}
              fallback={<p class="text-xl">Saving...</p>}
            >
              <ModalHeadClose closeFn={props.closeFn} />
              <div class="flex items-center justify-center h-full">
                <p class="text-xl">{submitRes.result}</p>
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
