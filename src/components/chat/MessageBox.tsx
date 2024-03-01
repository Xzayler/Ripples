"use client";

import messageIcon from "/icons/message.svg";
import arrowsIcon from "/icons/double-arrows.svg";

import { createSignal } from "solid-js";

export default function MessageBox() {
  const [isClicked, setIsClicked] = createSignal(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const dropDownStyle = isClicked()
    ? { transform: "translateY(calc(100% - 53px))" }
    : { transform: "translateY(0)" };

  return (
    <div
      class="w-[350px] rounded-2xl rounded-b-none transition duration-300 bg-background shadow-[0px_0px_15px_rgba(255,255,255,0.2),_0px_0px_3px_1px_rgba(255,255,255,0.15);]"
      style={dropDownStyle}
    >
      <div class="h-[53px] px-4 flex items-center w-full" onClick={handleClick}>
        <div class="text-xl font-bold mr-auto">Messages</div>
        <div class="flex gap-4">
          {messageIcon}
          <div class="transform -rotate-90">
            {arrowsIcon}
          </div>
        </div>
      </div>
      <div class="min-h-40"></div>
    </div>
  );
}
