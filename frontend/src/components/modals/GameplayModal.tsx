"use client";

import { useEffect } from "react";
import GameButton from "../GameActionButton";
import ModalGameIcon from "./ModalGameIcon";
import Fiftyicon from "/src/assets/Fiftyicon.svg";
import peopleicon from "/src/assets/peopleicon.svg";

interface GameplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  promptText?: string;
  GameScore?: number;
}

export default function GameplayModal({
  isOpen,
  onClose,
  promptText = "Do you want to continue?",
  title = "Congratulation!",
  GameScore = 4500,
}: GameplayModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 flex items-center   justify-center bg-[#1B171799] h-full  z-50 
      transition-opacity duration-300 ease-in-out 
      ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      onClick={onClose}
    >
      <div
        className={`bg-[#01100F] rounded-[20px] w-full max-w-xl p-6 shadow-xl relative 
        transform transition-all duration-500 ease-in-out
        ${
          isOpen
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-90 translate-y-10 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 className="text-[#048179] text-2xl md:text-3xl font-semibold text-center tracking-widest">
          {title}
        </h3>

        {/* Score and Icons */}
        <div className="flex flex-col gap-3 justify-center items-center mt-4">
          <img
            src="/src/assets/goldbag.svg"
            alt="Gold Bag"
            className="w-40 md:w-52"
          />
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-t from-[#EE2B22] via-[#F9BC07] to-[#FDD405] text-transparent bg-clip-text">
            {GameScore}
          </h1>
          <div className="flex justify-center gap-3">
            <ModalGameIcon number="12700" />
            <ModalGameIcon number="12000" icon={peopleicon} />
            <ModalGameIcon number="10000" icon={Fiftyicon} />
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex flex-col mt-4 gap-3">
          <p className="text-[#CFFDED] text-base text-center font-prompt">
            {promptText}
          </p>
          <div className="flex flex-col gap-2 justify-center items-center">
            <GameButton
              text="Next"
              href="/"
              borderColor="bg-[#F9BC07]"
              bgColor="bg-[#033330]"
            />
            <GameButton
              text="Replay"
              href="/"
              borderColor="bg-[#F9BC07]"
              bgColor="bg-[#000F33]"
            />
            <GameButton
              text="Exit"
              borderColor="bg-[#CFFDED]"
              bgColor="bg-[#01100F]"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
