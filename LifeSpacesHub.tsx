import React, { useState } from "react";
import { ArrowLeft, Check, Loader2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { PASTEL_CARD_CLASSES } from "../data/defaults";
import {
  fmt,
  formatLocaleMoney,
  formatLocaleNumber,
  getLanguageMeta,
  t,
} from "../i18n/translations";
import type {
  AppLanguage,
  AppRegion,
  BirthdayPerson,
  ButterAutomation,
  GiftPlan,
  HomeCareTask,
  PackKit,
  SavedPlace,
} from "../types/butter";
import { GiftIcon, MagicWandIcon, SelfCareIcon } from "./CuteIcons";

interface SubHeaderProps {
  title: string;
  subtitle: string;
  emoji: string;
  backLabel: string;
  onBack: () => void;
}

const SubHeader: React.FC<SubHeaderProps> = ({ title, subtitle, emoji, backLabel, onBack }) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={onBack}
      aria-label={backLabel}
      className="min-w-[44px] min-h-[44px] rounded-2xl bg-[#F3EFE7] dark:bg-[#27252A] flex items-center justify-center text-[#2A2724] dark:text-[#F7F4EE]"
    >
      <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
    </button>
    <div className="w-11 h-11 rounded-2xl bg-[#FDF3CD] dark:bg-[#38321F] flex items-center justify-center text-xl">
      {emoji}
    </div>
    <div>
      <h1 className="font-display text-2xl font-bold text-[#2A2724] dark:text-[#F7F4EE]">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-[#6C665F] dark:text-[#B6AFA6]">{subtitle}</p>
    </div>
  </div>
);

/* 1. PACK & GO 🎒 */
interface PackAndGoViewProps {
  language: AppLanguage;
  region: AppRegion;
  kits: PackKit[];
  onToggleItem: (kitId: string, itemId: string) => void;
  onAddItem: (kitId: string, text: string) => void;
  onResetKit: (kitId: string) => void;
  onCreateKit: (title: string, items: string[]) => void;
  onDeleteKit: (kitId: string) => void;
  onBack: () => void;
}

export const PackAndGoView: React.FC<PackAndGoViewProps> = ({
  language,
  region,
  kits,
  onToggleItem,
  onAddItem,
  onResetKit,
  onCreateKit,
  onDeleteKit,
  onBack,
}) => {
  const tr = t(language);
  const [newKitTitle, setNewKitTitle] = useState("");
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [itemDrafts, setItemDrafts] = useState<Record<string, string>>({});

  const handleSuggestKit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKitTitle.trim()) return;
    setSuggestLoading(true);
    setSuggestError(null);
    try {
      const res = await fetch("/api/suggest-pack-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: newKitTitle.trim(),
          language: getLanguageMeta(language).englishName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || tr.errorGeneric);
      const suggested = Array.isArray(data.items) ? data.items.map(String) : [];
      onCreateKit(newKitTitle.trim(), suggested);
      setNewKitTitle("");
    } catch (err: unknown) {
      setSuggestError(err instanceof Error ? err.message : tr.errorGeneric);
    } finally {
      setSuggestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SubHeader
        title={tr.packTitle}
        subtitle={tr.packSub}
        emoji="🎒"
        backLabel={tr.back}
        onBack={onBack}
      />

      <form
        onSubmit={handleSuggestKit}
        className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-4 sm:p-5 space-y-3"
      >
        <p className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE]">
          {tr.packSuggestPrompt}
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={newKitTitle}
            onChange={(e) => setNewKitTitle(e.target.value)}
            placeholder={tr.packPlaceholder}
            className="flex-1 min-w-[200px] min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
          />
          <button
            type="button"
            disabled={!newKitTitle.trim()}
            onClick={() => {
              if (!newKitTitle.trim()) return;
              onCreateKit(newKitTitle.trim(), []);
              setNewKitTitle("");
            }}
            className="min-h-[44px] px-4 rounded-2xl bg-[#F3EFE7] dark:bg-[#323036] text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE] disabled:opacity-45"
          >
            {tr.emptyKit}
          </button>
          <button
            type="submit"
            disabled={suggestLoading || !newKitTitle.trim()}
            className="min-h-[44px] px-4 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-45"
          >
            {suggestLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MagicWandIcon className="w-4 h-4" />}
            <span>{tr.suggestItems}</span>
          </button>
        </div>
        {suggestError && (
          <p className="text-xs text-[#9E475B] dark:text-[#FFD6E1]">{suggestError}</p>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {kits.map((kit) => {
          const packed = kit.items.filter((i) => i.checked).length;
          const draft = itemDrafts[kit.id] || "";
          return (
            <section key={kit.id} className={`rounded-3xl border p-5 space-y-3.5 ${PASTEL_CARD_CLASSES[kit.pastel]}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{kit.emoji}</span>
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#2A2724] dark:text-[#F7F4EE]">
                      {kit.title}
                    </h2>
                    <p className="text-xs text-[#6C665F] dark:text-[#C8C2B8] font-mono-num">
                      {fmt(tr.packedCount, {
                        done: formatLocaleNumber(packed, language, region),
                        total: formatLocaleNumber(kit.items.length, language, region),
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onResetKit(kit.id)}
                    aria-label={kit.title}
                    className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-[#5C564F] hover:bg-white/60"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteKit(kit.id)}
                    aria-label={tr.deleteLabel}
                    className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-[#9E475B] hover:bg-white/60"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {kit.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleItem(kit.id, item.id)}
                    className="w-full min-h-[44px] rounded-2xl bg-white/80 dark:bg-[#1E1C21]/75 px-3.5 py-2 flex items-center gap-3 text-start"
                  >
                    <span
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                        item.checked
                          ? "bg-[#4A7C59] border-[#4A7C59] text-white"
                          : "bg-white dark:bg-[#27252A] border-[#CFC8BC]"
                      }`}
                    >
                      {item.checked && <Check className="w-3.5 h-3.5" />}
                    </span>
                    <span className={`text-sm font-medium ${item.checked ? "line-through opacity-55" : ""}`}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft.trim()) return;
                  onAddItem(kit.id, draft.trim());
                  setItemDrafts((p) => ({ ...p, [kit.id]: "" }));
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setItemDrafts((p) => ({ ...p, [kit.id]: e.target.value }))}
                  placeholder={tr.addItemPlaceholder}
                  className="flex-1 min-h-[44px] px-3.5 rounded-2xl bg-white/90 dark:bg-[#1B191E] border border-[#E2DDD2] dark:border-white/15 text-sm"
                />
                <button
                  type="submit"
                  aria-label={tr.add}
                  className="min-w-[44px] min-h-[44px] rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724] flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>
            </section>
          );
        })}
      </div>
    </div>
  );
};

/* 2. MY PLACES 📍 */
interface PlacesViewProps {
  language: AppLanguage;
  places: SavedPlace[];
  onAddPlace: (place: Omit<SavedPlace, "id">) => void;
  onUpdatePlace: (id: string, patch: Partial<SavedPlace>) => void;
  onDeletePlace: (id: string) => void;
  onBack: () => void;
}

export const PlacesView: React.FC<PlacesViewProps> = ({
  language,
  places,
  onAddPlace,
  onUpdatePlace,
  onDeletePlace,
  onBack,
}) => {
  const tr = t(language);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [reminderText, setReminderText] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddPlace({
      name: name.trim(),
      emoji: "📍",
      note: note.trim(),
      reminderText: reminderText.trim(),
      pastel: "sky",
    });
    setName("");
    setNote("");
    setReminderText("");
  };

  return (
    <div className="space-y-6">
      <SubHeader
        title={tr.placesTitle}
        subtitle={tr.placesSub}
        emoji="📍"
        backLabel={tr.back}
        onBack={onBack}
      />

      <form
        onSubmit={handleAdd}
        className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 grid grid-cols-1 sm:grid-cols-4 gap-3"
      >
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={tr.placeNamePh}
          className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={tr.placeNotePh}
          className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
        />
        <input
          type="text"
          value={reminderText}
          onChange={(e) => setReminderText(e.target.value)}
          placeholder={tr.placeReminderPh}
          className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
        />
        <button
          type="submit"
          className="min-h-[44px] px-4 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold"
        >
          {tr.savePlace}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {places.map((p) => (
          <div key={p.id} className={`rounded-3xl border p-5 space-y-3 ${PASTEL_CARD_CLASSES[p.pastel]}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{p.emoji}</span>
                <h2 className="font-display text-lg font-bold text-[#2A2724] dark:text-[#F7F4EE]">
                  {p.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onDeletePlace(p.id)}
                aria-label={tr.deleteLabel}
                className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-[#9E475B]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {p.note && <p className="text-sm text-[#4A453E] dark:text-[#D5CFC5]">{p.note}</p>}
            <div className="rounded-2xl bg-white/75 dark:bg-black/20 px-3.5 py-2.5">
              <label className="block text-[11px] font-semibold text-[#6C665F] dark:text-[#B6AFA6]">
                {tr.arrivalReminder}
              </label>
              <input
                type="text"
                value={p.reminderText}
                onChange={(e) => onUpdatePlace(p.id, { reminderText: e.target.value })}
                placeholder={tr.placeReminderPh}
                className="w-full bg-transparent text-sm font-medium text-[#2A2724] dark:text-[#F7F4EE] focus:outline-none mt-0.5"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 3. HOME CARE 🌱 & LAUNDRY 🧺 */
interface HomeCareViewProps {
  language: AppLanguage;
  items: HomeCareTask[];
  onToggle: (id: string) => void;
  onAdd: (title: string, kind: "home" | "laundry", schedule: HomeCareTask["schedule"]) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const HomeCareView: React.FC<HomeCareViewProps> = ({
  language,
  items,
  onToggle,
  onAdd,
  onDelete,
  onBack,
}) => {
  const tr = t(language);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<"home" | "laundry">("home");
  const [schedule, setSchedule] = useState<HomeCareTask["schedule"]>("Weekly");

  const homeItems = items.filter((i) => i.kind === "home");
  const laundryItems = items.filter((i) => i.kind === "laundry");

  return (
    <div className="space-y-6">
      <SubHeader
        title={tr.homeCareTitle}
        subtitle={tr.homeCareSub}
        emoji="🌱"
        backLabel={tr.back}
        onBack={onBack}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onAdd(title.trim(), kind, schedule);
          setTitle("");
        }}
        className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 flex flex-wrap gap-2.5"
      >
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={tr.homeCarePlaceholder}
          className="flex-1 min-w-[180px] min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
        />
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as "home" | "laundry")}
          className="min-h-[44px] px-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
        >
          <option value="home">{tr.homeCareSection}</option>
          <option value="laundry">{tr.laundrySection}</option>
        </select>
        <select
          value={schedule}
          onChange={(e) => setSchedule(e.target.value as HomeCareTask["schedule"])}
          className="min-h-[44px] px-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
        >
          {(Object.keys(tr.homeCareSchedules) as HomeCareTask["schedule"][]).map((sc) => (
            <option key={sc} value={sc}>
              {tr.homeCareSchedules[sc]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="min-h-[44px] px-5 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold"
        >
          {tr.addRoutine}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <SelfCareIcon className="w-7 h-7" />
            <h2 className="font-display text-lg font-bold">{tr.homeCareSection}</h2>
          </div>
          {homeItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-3.5 flex items-center gap-3 ${PASTEL_CARD_CLASSES[item.pastel]}`}
            >
              <button
                type="button"
                onClick={() => onToggle(item.id)}
                className={`min-w-[40px] min-h-[40px] rounded-xl border flex items-center justify-center ${
                  item.doneThisCycle ? "bg-[#4A7C59] border-[#4A7C59] text-white" : "bg-white/85 border-[#CFC8BC]"
                }`}
              >
                {item.doneThisCycle && <Check className="w-4 h-4" />}
              </button>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${item.doneThisCycle ? "line-through opacity-60" : ""}`}>
                  {item.title}
                </p>
                <p className="text-xs text-[#6C665F] dark:text-[#C8C2B8]">
                  {tr.homeCareSchedules[item.schedule]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                aria-label={tr.deleteLabel}
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#9E475B]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>

        <section className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧺</span>
            <h2 className="font-display text-lg font-bold">{tr.laundrySection}</h2>
          </div>
          {laundryItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-3.5 flex items-center gap-3 ${PASTEL_CARD_CLASSES[item.pastel]}`}
            >
              <button
                type="button"
                onClick={() => onToggle(item.id)}
                className={`min-w-[40px] min-h-[40px] rounded-xl border flex items-center justify-center ${
                  item.doneThisCycle ? "bg-[#4A7C59] border-[#4A7C59] text-white" : "bg-white/85 border-[#CFC8BC]"
                }`}
              >
                {item.doneThisCycle && <Check className="w-4 h-4" />}
              </button>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${item.doneThisCycle ? "line-through opacity-60" : ""}`}>
                  {item.title}
                </p>
                <p className="text-xs text-[#6C665F] dark:text-[#C8C2B8]">
                  {tr.homeCareSchedules[item.schedule]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                aria-label={tr.deleteLabel}
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#9E475B]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

/* 4. BIRTHDAYS 🎂 & GIFT PLANNER 🎁 */
interface BirthdaysAndGiftsViewProps {
  language: AppLanguage;
  region: AppRegion;
  tab: "birthdays" | "gifts";
  onChangeTab: (tab: "birthdays" | "gifts") => void;
  currency: "IQD" | "USD" | "EUR";
  birthdays: BirthdayPerson[];
  gifts: GiftPlan[];
  onAddBirthday: (b: Omit<BirthdayPerson, "id">) => void;
  onDeleteBirthday: (id: string) => void;
  onAddGift: (g: Omit<GiftPlan, "id">) => void;
  onCycleGiftStatus: (id: string) => void;
  onDeleteGift: (id: string) => void;
  onBack: () => void;
}

export const BirthdaysAndGiftsView: React.FC<BirthdaysAndGiftsViewProps> = ({
  language,
  region,
  tab,
  onChangeTab,
  currency,
  birthdays,
  gifts,
  onAddBirthday,
  onDeleteBirthday,
  onAddGift,
  onCycleGiftStatus,
  onDeleteGift,
  onBack,
}) => {
  const tr = t(language);
  const [bName, setBName] = useState("");
  const [bDate, setBDate] = useState("");
  const [bIdea, setBIdea] = useState("");

  const [gPerson, setGPerson] = useState("");
  const [gGift, setGGift] = useState("");
  const [gBudget, setGBudget] = useState("");
  const [gDate, setGDate] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SubHeader
          title={tab === "birthdays" ? tr.birthdaysTitle : tr.giftsTitle}
          subtitle={tr.birthdaysGiftsSub}
          emoji={tab === "birthdays" ? "🎂" : "🎁"}
          backLabel={tr.back}
          onBack={onBack}
        />

        <div className="inline-flex p-1 rounded-2xl bg-[#F3EFE7] dark:bg-[#27252A]">
          <button
            type="button"
            onClick={() => onChangeTab("birthdays")}
            className={`min-h-[40px] px-4 rounded-xl text-sm font-semibold ${
              tab === "birthdays" ? "bg-white dark:bg-[#36333A] shadow-sm" : "text-[#6C665F]"
            }`}
          >
            {tr.birthdaysTitle}
          </button>
          <button
            type="button"
            onClick={() => onChangeTab("gifts")}
            className={`min-h-[40px] px-4 rounded-xl text-sm font-semibold ${
              tab === "gifts" ? "bg-white dark:bg-[#36333A] shadow-sm" : "text-[#6C665F]"
            }`}
          >
            {tr.giftsTitle}
          </button>
        </div>
      </div>

      {tab === "birthdays" ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!bName.trim() || !bDate.trim()) return;
              onAddBirthday({
                name: bName.trim(),
                dateMM_DD: bDate.trim(),
                giftIdea: bIdea.trim(),
                notes: "",
                pastel: "pink",
              });
              setBName("");
              setBDate("");
              setBIdea("");
            }}
            className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 grid grid-cols-1 sm:grid-cols-4 gap-3"
          >
            <input
              type="text"
              required
              value={bName}
              onChange={(e) => setBName(e.target.value)}
              placeholder={tr.personNamePh}
              className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
            />
            <input
              type="text"
              required
              value={bDate}
              onChange={(e) => setBDate(e.target.value)}
              placeholder="MM-DD (e.g. 11-24)"
              className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 font-mono-num text-sm"
            />
            <input
              type="text"
              value={bIdea}
              onChange={(e) => setBIdea(e.target.value)}
              placeholder={tr.giftIdeaPh}
              className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold"
            >
              {tr.saveBirthday}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {birthdays.map((b) => (
              <div key={b.id} className={`rounded-3xl border p-5 space-y-2 ${PASTEL_CARD_CLASSES[b.pastel]}`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold">
                    🎂 {b.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num text-xs font-semibold text-[#6C665F] dark:text-[#C8C2B8]">
                      {b.dateMM_DD}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteBirthday(b.id)}
                      aria-label={tr.deleteLabel}
                      className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#9E475B]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {b.giftIdea && <p className="text-sm">🎁 {b.giftIdea}</p>}
                {b.notes && <p className="text-xs text-[#6C665F] dark:text-[#C8C2B8]">{b.notes}</p>}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!gPerson.trim() || !gGift.trim()) return;
              onAddGift({
                person: gPerson.trim(),
                gift: gGift.trim(),
                budget: Number(gBudget) || 0,
                dateLabel: gDate.trim() || "—",
                status: "Idea",
                notes: "",
                pastel: "yellow",
              });
              setGPerson("");
              setGGift("");
              setGBudget("");
              setGDate("");
            }}
            className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 grid grid-cols-1 sm:grid-cols-5 gap-3"
          >
            <input
              type="text"
              required
              value={gPerson}
              onChange={(e) => setGPerson(e.target.value)}
              placeholder={tr.forWhoPh}
              className="min-h-[44px] px-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
            />
            <input
              type="text"
              required
              value={gGift}
              onChange={(e) => setGGift(e.target.value)}
              placeholder={tr.giftIdeaPh}
              className="min-h-[44px] px-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
            />
            <input
              type="number"
              value={gBudget}
              onChange={(e) => setGBudget(e.target.value)}
              placeholder={`${tr.budgetPh} (${currency})`}
              className="min-h-[44px] px-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 font-mono-num text-sm"
            />
            <input
              type="text"
              value={gDate}
              onChange={(e) => setGDate(e.target.value)}
              placeholder={tr.dateExamplePh}
              className="min-h-[44px] px-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold"
            >
              {tr.addGift}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gifts.map((g) => (
              <div key={g.id} className={`rounded-3xl border p-5 space-y-3 ${PASTEL_CARD_CLASSES[g.pastel]}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <GiftIcon className="w-7 h-7" />
                    <div>
                      <h2 className="font-display text-lg font-bold">{g.person}</h2>
                      <p className="text-xs text-[#6C665F] dark:text-[#C8C2B8]">📅 {g.dateLabel}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteGift(g.id)}
                    aria-label={tr.deleteLabel}
                    className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#9E475B]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-semibold">🎁 {g.gift}</p>
                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/10">
                  <span className="font-mono-num text-xs font-semibold">
                    💰 {formatLocaleMoney(g.budget, currency, language, region)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCycleGiftStatus(g.id)}
                    className="min-h-[36px] px-3 rounded-xl bg-white/85 dark:bg-black/25 text-xs font-semibold"
                  >
                    {tr.statusLabel} {tr.giftStatuses[g.status]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* 5. BUTTER AUTOMATIONS 🪄 */
interface AutomationsViewProps {
  language: AppLanguage;
  automations: ButterAutomation[];
  onToggle: (id: string) => void;
  onAdd: (whenLabel: string, doLabel: string, triggerType: ButterAutomation["triggerType"]) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  language,
  automations,
  onToggle,
  onAdd,
  onDelete,
  onBack,
}) => {
  const tr = t(language);
  const [whenLabel, setWhenLabel] = useState("");
  const [doLabel, setDoLabel] = useState("");
  const [triggerType, setTriggerType] = useState<ButterAutomation["triggerType"]>("day");

  return (
    <div className="space-y-6">
      <SubHeader
        title={tr.automationsTitle}
        subtitle={tr.automationsSub}
        emoji="🪄"
        backLabel={tr.back}
        onBack={onBack}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!whenLabel.trim() || !doLabel.trim()) return;
          onAdd(whenLabel.trim(), doLabel.trim(), triggerType);
          setWhenLabel("");
          setDoLabel("");
        }}
        className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            value={whenLabel}
            onChange={(e) => setWhenLabel(e.target.value)}
            placeholder={tr.whenPh}
            className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
          />
          <input
            type="text"
            required
            value={doLabel}
            onChange={(e) => setDoLabel(e.target.value)}
            placeholder={tr.doPh}
            className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
          />
          <div className="flex gap-2">
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value as ButterAutomation["triggerType"])}
              className="flex-1 min-h-[44px] px-3 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
            >
              <option value="day">{tr.trigDay}</option>
              <option value="location">{tr.trigLocation}</option>
              <option value="monthly">{tr.trigMonthly}</option>
              <option value="time">{tr.trigTime}</option>
            </select>
            <button
              type="submit"
              className="min-h-[44px] px-5 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold"
            >
              {tr.save}
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((au) => (
          <div
            key={au.id}
            className={`rounded-3xl border p-5 space-y-3 transition-opacity ${PASTEL_CARD_CLASSES[au.pastel]} ${
              au.enabled ? "" : "opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[#6C665F] dark:text-[#C8C2B8]">
                  {tr.whenPrefix} · {au.whenLabel}
                </p>
                <p className="font-display text-base font-bold text-[#2A2724] dark:text-[#F7F4EE]">
                  {au.doLabel}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  role="switch"
                  aria-checked={au.enabled}
                  onClick={() => onToggle(au.id)}
                  className={`min-w-[50px] min-h-[32px] rounded-full p-1 transition-colors ${
                    au.enabled ? "bg-[#669977]" : "bg-[#D8D2C8] dark:bg-[#49454C]"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      au.enabled ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(au.id)}
                  aria-label={tr.deleteLabel}
                  className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#9E475B]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
