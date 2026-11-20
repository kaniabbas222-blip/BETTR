import React from "react";
import type { AvatarConfig, RoomConfig } from "../types/butter";
import { AvatarCanvas, type AvatarMood } from "./AvatarCanvas";
import { SelfCareIcon } from "./CuteIcons";

interface AvatarRoomSceneProps {
  avatar: AvatarConfig;
  room: RoomConfig;
  mood: AvatarMood;
  animated: boolean;
}

const BACKDROP_CLASSES = {
  sky: "from-[#E3F1FA] via-[#FAF8F4] to-[#E6F1E9] dark:from-[#21303B] dark:via-[#27252A] dark:to-[#24332A]",
  sage: "from-[#DCECE1] via-[#FAF9F5] to-[#FDF3CD] dark:from-[#223328] dark:via-[#27252A] dark:to-[#332E1E]",
  butter: "from-[#FDF3CD] via-[#FAF8F4] to-[#FCEAF0] dark:from-[#38321F] dark:via-[#27252A] dark:to-[#38252C]",
  lavender: "from-[#EFEAF9] via-[#FAF8F4] to-[#E3F1FA] dark:from-[#2D273B] dark:via-[#27252A] dark:to-[#21303B]",
  dusk: "from-[#2D293E] via-[#27252A] to-[#23323C] dark:from-[#1D1B2A] dark:via-[#212026] dark:to-[#1C2730]",
};

export const AvatarRoomScene: React.FC<AvatarRoomSceneProps> = ({
  avatar,
  room,
  mood,
  animated,
}) => {
  return (
    <div
      className={`relative w-full rounded-3xl bg-gradient-to-b ${BACKDROP_CLASSES[room.backdrop]} border border-[#E5E0D5] dark:border-white/10 overflow-hidden min-h-[240px] flex flex-col items-center justify-end pt-6 pb-3 px-4`}
    >
      {/* Fairy lights / decor top */}
      {room.decor === "fairy-lights" && (
        <svg
          viewBox="0 0 320 40"
          className="w-full h-9 absolute top-0 left-0 pointer-events-none"
          aria-hidden="true"
        >
          <path d="M0 10 Q80 32 160 12 T320 14" stroke="#8C7F70" strokeWidth="1.4" fill="none" opacity="0.55" />
          <circle cx="48" cy="20" r="4" fill="#FBE28A" />
          <circle cx="110" cy="21" r="4" fill="#FCE6EC" />
          <circle cx="176" cy="14" r="4" fill="#FBE28A" />
          <circle cx="238" cy="22" r="4" fill="#DCEEF8" />
          <circle cx="290" cy="17" r="4" fill="#FBE28A" />
        </svg>
      )}

      {/* Wall Poster left */}
      {room.poster !== "none" && (
        <div
          className="absolute top-9 left-5 w-14 h-18 rounded-xl bg-white/85 dark:bg-black/25 border-2 border-[#D8D0C2] dark:border-white/15 flex items-center justify-center shadow-xs pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-xl">
            {room.poster === "sun" ? "☀️" : room.poster === "clouds" ? "☁️" : "🌿"}
          </span>
        </div>
      )}

      {/* Arched Window */}
      <div
        className="w-40 h-44 rounded-t-full rounded-b-2xl bg-[#DCEEF8]/85 dark:bg-[#2B3F4F]/75 border-2 border-white/90 dark:border-white/15 absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-10 h-10 rounded-full bg-[#FDF1C7] absolute top-4 right-5 opacity-95" />
        <div className="w-20 h-6 rounded-full bg-white/80 absolute top-12 left-2" />
        <div className="w-full h-0.5 bg-white/80 dark:bg-white/15 absolute top-22" />
        <div className="h-full w-0.5 bg-white/80 dark:bg-white/15 absolute left-1/2" />
      </div>

      {/* Hanging Plant */}
      {room.plant === "hanging" && (
        <div className="absolute top-3 right-6 text-2xl pointer-events-none" aria-hidden="true">
          🪴
        </div>
      )}

      {/* Furniture */}
      {room.furniture === "cozy-desk" && (
        <div
          className="absolute bottom-5 right-4 w-20 h-12 rounded-t-xl bg-[#EADAC0] dark:bg-[#494035] border border-[#C9B79B] dark:border-white/15 pointer-events-none flex items-center justify-center"
          aria-hidden="true"
        >
          {room.decor === "tea-set" && <span className="text-base -mt-7">🍵</span>}
          {room.decor === "bookshelf" && <span className="text-base -mt-7">📚</span>}
        </div>
      )}
      {room.furniture === "daybed" && (
        <div
          className="absolute bottom-4 right-3 w-24 h-11 rounded-2xl bg-[#EFEAF9] dark:bg-[#3A314E] border border-[#D4C7EB] dark:border-white/15 pointer-events-none"
          aria-hidden="true"
        />
      )}
      {room.furniture === "reading-nook" && (
        <div
          className="absolute bottom-4 right-4 w-16 h-14 rounded-t-3xl rounded-b-xl bg-[#FCEAF0] dark:bg-[#492D38] border border-[#E7B6C5] dark:border-white/15 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Floor Plants */}
      {room.plant === "sprout" && (
        <div className="absolute bottom-4 left-5 pointer-events-none" aria-hidden="true">
          <SelfCareIcon className="w-11 h-11" />
        </div>
      )}
      {room.plant === "monstera" && (
        <div className="absolute bottom-4 left-4 text-3xl pointer-events-none" aria-hidden="true">
          🌿
        </div>
      )}

      {/* Rug */}
      <div
        className="w-56 h-11 rounded-full border border-black/10 dark:border-white/10 absolute bottom-2 pointer-events-none"
        style={{ backgroundColor: room.rugColor, opacity: 0.85 }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <AvatarCanvas config={avatar} mood={mood} animated={animated} size="lg" />
      </div>
    </div>
  );
};
