import React, { useState } from "react";
import { Shuffle } from "lucide-react";
import {
  BOTTOM_COLORS,
  HAIR_COLORS,
  SKIN_TONES,
  TOP_COLORS,
} from "../data/defaults";
import { fmt, formatLocaleNumber, t } from "../i18n/translations";
import type {
  AppLanguage,
  AvatarConfig,
  AvatarStyle,
  BagStyle,
  BottomStyle,
  DressStyle,
  GlassesStyle,
  HairStyle,
  HatStyle,
  HeadphoneStyle,
  JacketStyle,
  RoomBackdrop,
  RoomConfig,
  RoomDecor,
  RoomFurniture,
  RoomPlant,
  RoomPoster,
  ShoeStyle,
  SmallAccStyle,
  TopStyle,
} from "../types/butter";
import { AvatarRoomScene } from "./AvatarRoomScene";

interface AvatarStudioProps {
  language: AppLanguage;
  initialConfig: AvatarConfig;
  initialRoom: RoomConfig;
  completedTasksCount?: number;
  onSave: (config: AvatarConfig, room: RoomConfig) => void;
  onCancel?: () => void;
  isEditingExisting?: boolean;
  animated?: boolean;
}

type StudioTab = "appearance" | "outfit" | "accessories" | "room";

const CHARACTER_STYLES: { id: AvatarStyle; label: string }[] = [
  { id: "soft", label: "Soft" },
  { id: "round", label: "Cozy Round" },
  { id: "slender", label: "Gentle" },
];

const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: "short", label: "Short Crop" },
  { id: "bob", label: "Soft Bob" },
  { id: "wavy", label: "Wavy Long" },
  { id: "buns", label: "Space Buns" },
  { id: "curly", label: "Curly Puff" },
  { id: "sweep", label: "Side Sweep" },
  { id: "spiky", label: "Playful Spiky" },
  { id: "braids", label: "Twin Braids" },
];

const TOP_STYLES: { id: TopStyle; label: string }[] = [
  { id: "sweater", label: "Knit Sweater" },
  { id: "tee", label: "Relaxed Tee" },
  { id: "hoodie", label: "Cozy Hoodie" },
  { id: "cardigan", label: "Cardigan" },
  { id: "overalls", label: "Overalls" },
];

const BOTTOM_STYLES: { id: BottomStyle; label: string }[] = [
  { id: "jeans", label: "Denim Jeans" },
  { id: "skirt", label: "Pleated Skirt" },
  { id: "joggers", label: "Joggers" },
  { id: "shorts", label: "Shorts" },
];

const DRESS_STYLES: { id: DressStyle; label: string }[] = [
  { id: "none", label: "Two-Piece" },
  { id: "pinafore", label: "Pinafore" },
  { id: "sundress", label: "Sundress" },
];

const JACKET_STYLES: { id: JacketStyle; label: string }[] = [
  { id: "none", label: "No Jacket" },
  { id: "denim", label: "Denim" },
  { id: "trench", label: "Trench" },
  { id: "varsity", label: "Varsity" },
];

const SHOE_STYLES: { id: ShoeStyle; label: string }[] = [
  { id: "sneakers", label: "Sneakers" },
  { id: "maryjanes", label: "Mary Janes" },
  { id: "boots", label: "Cozy Boots" },
  { id: "loafers", label: "Loafers" },
];

const GLASSES_OPTIONS: { id: GlassesStyle; label: string }[] = [
  { id: "none", label: "None" },
  { id: "round", label: "Round Wire" },
  { id: "tortoise", label: "Tortoise" },
  { id: "sun", label: "Sunglasses" },
];

const HAT_OPTIONS: { id: HatStyle; label: string }[] = [
  { id: "none", label: "None" },
  { id: "beanie", label: "Beanie" },
  { id: "beret", label: "Beret" },
  { id: "bucket", label: "Bucket Hat" },
  { id: "bow", label: "Ribbon Bow" },
];

const BAG_OPTIONS: { id: BagStyle; label: string }[] = [
  { id: "none", label: "None" },
  { id: "tote", label: "Canvas Tote" },
  { id: "crossbody", label: "Crossbody" },
  { id: "backpack", label: "Backpack" },
];

const HEADPHONE_OPTIONS: { id: HeadphoneStyle; label: string }[] = [
  { id: "none", label: "None" },
  { id: "pastel", label: "Over-Ear" },
];

const SMALL_ACC_OPTIONS: { id: SmallAccStyle; label: string }[] = [
  { id: "none", label: "None" },
  { id: "blush", label: "Rosy Blush" },
  { id: "freckles", label: "Freckles" },
  { id: "starpin", label: "Star Pin" },
  { id: "scarf", label: "Cozy Scarf" },
];

const ROOM_BACKDROPS: { id: RoomBackdrop; label: string }[] = [
  { id: "sky", label: "Morning Sky" },
  { id: "sage", label: "Sage Garden" },
  { id: "butter", label: "Warm Sunbeam" },
  { id: "lavender", label: "Soft Lilac" },
  { id: "dusk", label: "Evening Dusk" },
];

const ROOM_PLANTS: { id: RoomPlant; label: string }[] = [
  { id: "sprout", label: "Desk Sprout" },
  { id: "monstera", label: "Monstera" },
  { id: "hanging", label: "Hanging Vine" },
  { id: "none", label: "No Plant" },
];

const ROOM_FURNITURE: { id: RoomFurniture; label: string }[] = [
  { id: "cozy-desk", label: "Study Desk" },
  { id: "reading-nook", label: "Reading Nook" },
  { id: "daybed", label: "Cozy Daybed" },
];

const ROOM_POSTERS: { id: RoomPoster; label: string }[] = [
  { id: "sun", label: "Sunny Frame" },
  { id: "clouds", label: "Cloud Print" },
  { id: "botanical", label: "Botanical" },
  { id: "none", label: "Clean Wall" },
];

const ROOM_DECOR: { id: RoomDecor; label: string }[] = [
  { id: "fairy-lights", label: "Fairy Lights" },
  { id: "tea-set", label: "Warm Tea Set" },
  { id: "bookshelf", label: "Mini Books" },
  { id: "none", label: "Minimal" },
];

export const AvatarStudio: React.FC<AvatarStudioProps> = ({
  language,
  initialConfig,
  initialRoom,
  completedTasksCount = 0,
  onSave,
  onCancel,
  isEditingExisting = false,
  animated = true,
}) => {
  const tr = t(language);
  const [draft, setDraft] = useState<AvatarConfig>(initialConfig);
  const [roomDraft, setRoomDraft] = useState<RoomConfig>(initialRoom);
  const [tab, setTab] = useState<StudioTab>("appearance");

  const update = <K extends keyof AvatarConfig>(key: K, val: AvatarConfig[K]) => {
    setDraft((prev) => ({ ...prev, [key]: val }));
  };

  const updateRoom = <K extends keyof RoomConfig>(key: K, val: RoomConfig[K]) => {
    setRoomDraft((prev) => ({ ...prev, [key]: val }));
  };

  const randomize = () => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const useDress = Math.random() > 0.72;
    setDraft((prev) => ({
      ...prev,
      style: pick(CHARACTER_STYLES).id,
      skinTone: pick(SKIN_TONES).value,
      hairStyle: pick(HAIR_STYLES).id,
      hairColor: pick(HAIR_COLORS).value,
      topStyle: pick(TOP_STYLES).id,
      topColor: pick(TOP_COLORS).value,
      bottomStyle: pick(BOTTOM_STYLES).id,
      bottomColor: pick(BOTTOM_COLORS).value,
      dressStyle: useDress ? pick(["pinafore", "sundress"] as DressStyle[]) : "none",
      dressColor: pick(TOP_COLORS).value,
      jacketStyle: pick(JACKET_STYLES).id,
      shoeStyle: pick(SHOE_STYLES).id,
      glasses: pick(GLASSES_OPTIONS).id,
      hat: pick(HAT_OPTIONS).id,
      bag: pick(BAG_OPTIONS).id,
      headphones: pick(HEADPHONE_OPTIONS).id,
      smallAcc: pick(SMALL_ACC_OPTIONS).id,
    }));
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#FDFBF7] dark:bg-[#1D1B1E] px-4 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-sheet-safe sm:px-6 lg:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2A2724] dark:text-[#F7F4EE]">
              {tr.studioTitle}
            </h1>
            <p className="text-sm text-[#6C665F] dark:text-[#B6AFA6] mt-1">
              {tr.studioSub}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isEditingExisting && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="min-h-[44px] px-4 rounded-2xl bg-[#F3EFE7] dark:bg-[#2C2A30] text-sm font-medium text-[#2A2724] dark:text-[#F7F4EE]"
              >
                {tr.back}
              </button>
            )}
            <button
              type="button"
              onClick={randomize}
              className="min-h-[44px] px-4 rounded-2xl bg-[#EFEAF9] dark:bg-[#2D273B] text-[#4C3B6E] dark:text-[#DCD2F2] text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Shuffle className="w-4 h-4" />
              <span>{tr.surpriseBtn}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Live Character + Room Preview */}
          <div className="md:col-span-5 md:sticky md:top-6 bg-white dark:bg-[#27252A] rounded-3xl p-4 sm:p-5 border border-[#E5E0D5] dark:border-white/10 flex flex-col items-center">
            <AvatarRoomScene avatar={draft} room={roomDraft} mood="relaxing" animated={animated} />

            <div className="w-full mt-4">
              <label
                htmlFor="avatar-name-input"
                className="block text-xs font-semibold text-[#6C665F] dark:text-[#B6AFA6] mb-1.5"
              >
                {tr.yourNameLabel}
              </label>
              <input
                id="avatar-name-input"
                type="text"
                value={draft.name}
                maxLength={24}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Mina, Leo, Noor..."
                className="w-full min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1D1B1E] border border-[#DFD9CE] dark:border-white/15 text-[#2A2724] dark:text-[#F7F4EE] text-sm font-medium"
              />
            </div>

            <button
              type="button"
              onClick={() => onSave({ ...draft, name: draft.name.trim() || "Friend" }, roomDraft)}
              className="w-full mt-4 min-h-[48px] px-6 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold text-base shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
            >
              {tr.thisIsMe}
            </button>
          </div>

          {/* Right Controls */}
          <div className="md:col-span-7 bg-white dark:bg-[#27252A] rounded-3xl p-4 sm:p-6 border border-[#ECE7DD] dark:border-white/10 shadow-sm">
            <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#F5F2EB] dark:bg-[#1D1B1E] mb-6" role="tablist">
              {(
                [
                  { id: "appearance", label: tr.tabLook },
                  { id: "outfit", label: tr.tabOutfit },
                  { id: "accessories", label: tr.tabExtras },
                  { id: "room", label: tr.tabRoom },
                ] as { id: StudioTab; label: string }[]
              ).map((tb) => (
                <button
                  key={tb.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === tb.id}
                  onClick={() => setTab(tb.id)}
                  className={`min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    tab === tb.id
                      ? "bg-white dark:bg-[#2F2D33] text-[#2A2724] dark:text-[#F7F4EE] shadow-sm"
                      : "text-[#6C665F] dark:text-[#B6AFA6]"
                  }`}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            {tab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2.5">
                    {tr.characterStyle}
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {CHARACTER_STYLES.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => update("style", opt.id)}
                        className={`min-h-[44px] px-3 rounded-2xl border text-sm font-medium ${
                          draft.style === opt.id
                            ? "bg-[#FDF1C7] dark:bg-[#4F472B] border-[#DFC97B] text-[#2A2724] dark:text-[#FDF1C7]"
                            : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2.5">
                    {tr.skinTone}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone.value}
                        type="button"
                        aria-label={tone.label}
                        onClick={() => update("skinTone", tone.value)}
                        className={`w-11 h-11 rounded-full border-2 transition-transform ${
                          draft.skinTone === tone.value
                            ? "border-[#2A2724] dark:border-[#FDF1C7] scale-110"
                            : "border-white dark:border-[#3A373E]"
                        }`}
                        style={{ backgroundColor: tone.value }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2.5">
                    {tr.hairStyle}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {HAIR_STYLES.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => update("hairStyle", opt.id)}
                        className={`min-h-[44px] px-3 rounded-2xl border text-xs sm:text-sm font-medium ${
                          draft.hairStyle === opt.id
                            ? "bg-[#DCEEF8] dark:bg-[#2B3E4D] border-[#A8CEE6] text-[#2A2724] dark:text-white"
                            : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2.5">
                    {tr.hairColor}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {HAIR_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        aria-label={color.label}
                        onClick={() => update("hairColor", color.value)}
                        className={`w-11 h-11 rounded-full border-2 transition-transform ${
                          draft.hairColor === color.value
                            ? "border-[#2A2724] dark:border-[#FDF1C7] scale-110"
                            : "border-white dark:border-[#3A373E]"
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "outfit" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2.5">
                    {tr.dressesOrTwoPiece}
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {DRESS_STYLES.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => update("dressStyle", opt.id)}
                        className={`min-h-[44px] px-3 rounded-2xl border text-sm font-medium ${
                          draft.dressStyle === opt.id
                            ? "bg-[#FCE6EC] dark:bg-[#492D38] border-[#E7B6C5] text-[#2A2724] dark:text-white"
                            : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {draft.dressStyle !== "none" ? (
                  <div>
                    <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2.5">
                      {tr.dressColor}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {TOP_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          aria-label={c.label}
                          onClick={() => update("dressColor", c.value)}
                          className={`w-11 h-11 rounded-full border-2 transition-transform ${
                            draft.dressColor === c.value
                              ? "border-[#2A2724] dark:border-[#FDF1C7] scale-110"
                              : "border-white dark:border-[#3A373E]"
                          }`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2.5">
                        {tr.tops}
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                        {TOP_STYLES.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => update("topStyle", opt.id)}
                            className={`min-h-[44px] px-3 rounded-2xl border text-sm font-medium ${
                              draft.topStyle === opt.id
                                ? "bg-[#DCECE1] dark:bg-[#283B2F] border-[#A7CEB4] text-[#2A2724] dark:text-white"
                                : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {TOP_COLORS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            aria-label={c.label}
                            onClick={() => update("topColor", c.value)}
                            className={`w-10 h-10 rounded-full border-2 ${
                              draft.topColor === c.value
                                ? "border-[#2A2724] dark:border-[#FDF1C7] scale-110"
                                : "border-white dark:border-[#3A373E]"
                            }`}
                            style={{ backgroundColor: c.value }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2.5">
                        {tr.bottoms}
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {BOTTOM_STYLES.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => update("bottomStyle", opt.id)}
                            className={`min-h-[44px] px-3 rounded-2xl border text-sm font-medium ${
                              draft.bottomStyle === opt.id
                                ? "bg-[#DCEEF8] dark:bg-[#2B3E4D] border-[#A8CEE6] text-[#2A2724] dark:text-white"
                                : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {BOTTOM_COLORS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            aria-label={c.label}
                            onClick={() => update("bottomColor", c.value)}
                            className={`w-10 h-10 rounded-full border-2 ${
                              draft.bottomColor === c.value
                                ? "border-[#2A2724] dark:border-[#FDF1C7] scale-110"
                                : "border-white dark:border-[#3A373E]"
                            }`}
                            style={{ backgroundColor: c.value }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                      {tr.jackets}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {JACKET_STYLES.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => update("jacketStyle", opt.id)}
                          className={`min-h-[44px] px-3 rounded-2xl border text-xs sm:text-sm font-medium ${
                            draft.jacketStyle === opt.id
                              ? "bg-[#FDF1C7] dark:bg-[#4F472B] border-[#DFC97B] text-[#2A2724] dark:text-[#FDF1C7]"
                              : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                      {tr.shoes}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {SHOE_STYLES.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => update("shoeStyle", opt.id)}
                          className={`min-h-[44px] px-3 rounded-2xl border text-xs sm:text-sm font-medium ${
                            draft.shoeStyle === opt.id
                              ? "bg-[#EAE4F7] dark:bg-[#3A314E] border-[#C8BBE6] text-[#2A2724] dark:text-white"
                              : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "accessories" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                    {tr.glassesLabel}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GLASSES_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => update("glasses", opt.id)}
                        className={`min-h-[44px] px-3 rounded-2xl border text-sm font-medium ${
                          draft.glasses === opt.id
                            ? "bg-[#DCEEF8] dark:bg-[#2B3E4D] border-[#A8CEE6] text-[#2A2724] dark:text-white"
                            : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                    {tr.hatsLabel}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {HAT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => update("hat", opt.id)}
                        className={`min-h-[44px] px-3 rounded-2xl border text-sm font-medium ${
                          draft.hat === opt.id
                            ? "bg-[#FCE6EC] dark:bg-[#492D38] border-[#E7B6C5] text-[#2A2724] dark:text-white"
                            : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                      {tr.bagsLabel}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {BAG_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => update("bag", opt.id)}
                          className={`min-h-[44px] px-3 rounded-2xl border text-xs sm:text-sm font-medium ${
                            draft.bag === opt.id
                              ? "bg-[#DCECE1] dark:bg-[#283B2F] border-[#A7CEB4] text-[#2A2724] dark:text-white"
                              : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                      {tr.headphonesLabel}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {HEADPHONE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => update("headphones", opt.id)}
                          className={`min-h-[44px] px-3 rounded-2xl border text-xs sm:text-sm font-medium ${
                            draft.headphones === opt.id
                              ? "bg-[#EAE4F7] dark:bg-[#3A314E] border-[#C8BBE6] text-[#2A2724] dark:text-white"
                              : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                    {tr.smallAccLabel}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SMALL_ACC_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => update("smallAcc", opt.id)}
                        className={`min-h-[44px] px-3 rounded-2xl border text-sm font-medium ${
                          draft.smallAcc === opt.id
                            ? "bg-[#FDF1C7] dark:bg-[#4F472B] border-[#DFC97B] text-[#2A2724] dark:text-[#FDF1C7]"
                            : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "room" && (
              <div className="space-y-5">
                <p className="text-xs text-[#6C665F] dark:text-[#B6AFA6]">
                  {fmt(tr.roomUnlockedNote, {
                    count: formatLocaleNumber(completedTasksCount, language, "auto"),
                  })}
                </p>

                <div>
                  <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                    {tr.roomBg}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ROOM_BACKDROPS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateRoom("backdrop", opt.id)}
                        className={`min-h-[44px] px-3 rounded-2xl border text-xs sm:text-sm font-medium ${
                          roomDraft.backdrop === opt.id
                            ? "bg-[#DCEEF8] dark:bg-[#2B3E4D] border-[#A8CEE6] text-[#2A2724] dark:text-white"
                            : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                      {tr.roomPlants}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {ROOM_PLANTS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateRoom("plant", opt.id)}
                          className={`min-h-[44px] px-3 rounded-2xl border text-xs font-medium ${
                            roomDraft.plant === opt.id
                              ? "bg-[#DCECE1] dark:bg-[#283B2F] border-[#A7CEB4] text-[#2A2724] dark:text-white"
                              : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                      {tr.roomFurniture}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {ROOM_FURNITURE.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateRoom("furniture", opt.id)}
                          className={`min-h-[44px] px-3 rounded-2xl border text-xs font-medium ${
                            roomDraft.furniture === opt.id
                              ? "bg-[#FDF1C7] dark:bg-[#4F472B] border-[#DFC97B] text-[#2A2724] dark:text-[#FDF1C7]"
                              : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                      {tr.roomPoster}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {ROOM_POSTERS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateRoom("poster", opt.id)}
                          className={`min-h-[44px] px-3 rounded-2xl border text-xs font-medium ${
                            roomDraft.poster === opt.id
                              ? "bg-[#FCE6EC] dark:bg-[#492D38] border-[#E7B6C5] text-[#2A2724] dark:text-white"
                              : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                      {tr.roomDecor}
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {ROOM_DECOR.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateRoom("decor", opt.id)}
                          className={`min-h-[44px] px-3 rounded-2xl border text-xs font-medium ${
                            roomDraft.decor === opt.id
                              ? "bg-[#EAE4F7] dark:bg-[#3A314E] border-[#C8BBE6] text-[#2A2724] dark:text-white"
                              : "bg-[#FAF8F4] dark:bg-[#1F1D22] border-[#E8E3D9] dark:border-white/10 text-[#59534C] dark:text-[#C8C2B8]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] mb-2">
                    {tr.rugTint}
                  </h2>
                  <div className="flex flex-wrap gap-2.5">
                    {TOP_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        aria-label={c.label}
                        onClick={() => updateRoom("rugColor", c.value)}
                        className={`w-10 h-10 rounded-full border-2 ${
                          roomDraft.rugColor === c.value
                            ? "border-[#2A2724] dark:border-[#FDF1C7] scale-110"
                            : "border-white dark:border-[#3A373E]"
                        }`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
