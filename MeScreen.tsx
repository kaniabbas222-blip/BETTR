import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Plus,
} from "lucide-react";
import { ACCENT_THEMES, MANUAL_CITIES, PASTEL_CARD_CLASSES } from "../data/defaults";
import {
  REGIONS,
  fmt,
  formatLocaleNumber,
  getLanguageMeta,
  t,
} from "../i18n/translations";
import type {
  AccentColorKey,
  AppRegion,
  AppSettings,
  AvatarConfig,
  HabitItem,
  HomeCardId,
  PersonalGoal,
  RoomConfig,
  SubView,
  TextScale,
} from "../types/butter";
import { AvatarCanvas } from "./AvatarCanvas";
import { GoalsIcon, MoneyIcon, SelfCareIcon } from "./CuteIcons";
import { PWAInstallCard } from "./PWAComponents";

interface MeScreenProps {
  avatar: AvatarConfig;
  room: RoomConfig;
  habits: HabitItem[];
  personalGoals: PersonalGoal[];
  memoriesCount: number;
  completedTasksCount: number;
  settings: AppSettings;
  onCustomizeAvatar: () => void;
  onToggleHabit: (id: string) => void;
  onAddHabit: (title: string, frequency: HabitItem["frequency"]) => void;
  onToggleGoalStep: (goalId: string, stepId: string) => void;
  onAddPersonalGoal: (title: string, description: string, targetDate: string, steps: string[]) => void;
  onOpenSubView: (view: SubView) => void;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onExportData: () => void;
  onResetApp: () => void;
}

export const MeScreen: React.FC<MeScreenProps> = ({
  avatar,
  habits,
  personalGoals,
  memoriesCount,
  completedTasksCount,
  settings,
  onCustomizeAvatar,
  onToggleHabit,
  onAddHabit,
  onToggleGoalStep,
  onAddPersonalGoal,
  onOpenSubView,
  onUpdateSettings,
  onExportData,
  onResetApp,
}) => {
  const tr = t(settings.language);
  const langMeta = getLanguageMeta(settings.language);

  const [newHabit, setNewHabit] = useState("");
  const [newHabitFreq, setNewHabitFreq] = useState<HabitItem["frequency"]>("Daily");

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [goalStepsText, setGoalStepsText] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);

  const completedGoalsCount = personalGoals.filter(
    (g) => g.steps.length > 0 && g.steps.every((s) => s.done)
  ).length;

  const achievements = [
    { id: "a1", icon: "✨", title: tr.achWeek, earned: settings.daysActive >= 7 },
    { id: "a2", icon: "🌱", title: tr.achGoal, earned: completedGoalsCount > 0 },
    { id: "a3", icon: "🫧", title: tr.achMemory, earned: memoriesCount >= 2 },
    { id: "a4", icon: "🌟", title: tr.achMonth, earned: settings.daysActive >= 30 },
    { id: "a5", icon: "🎯", title: tr.achOrganizer, earned: completedTasksCount >= 5 },
  ];

  const moveHomeCard = (index: number, dir: -1 | 1) => {
    const next = [...settings.homeCardOrder];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onUpdateSettings({ homeCardOrder: next });
  };

  const toggleHideCard = (id: HomeCardId) => {
    const hidden = settings.hiddenHomeCards.includes(id)
      ? settings.hiddenHomeCards.filter((c) => c !== id)
      : [...settings.hiddenHomeCards, id];
    onUpdateSettings({ hiddenHomeCards: hidden });
  };

  return (
    <div className="space-y-6">
      {/* Avatar & Room Header */}
      <section className="rounded-3xl bg-gradient-to-r from-[#FDF3CD]/80 via-[#FCEAF0]/70 to-[#E3F1FA]/80 dark:from-[#342E1D] dark:via-[#36252C] dark:to-[#21303B] border border-[#EAE4D8] dark:border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="rounded-3xl bg-white/75 dark:bg-black/20 p-2 border border-white/80 dark:border-white/10 shrink-0">
          <AvatarCanvas
            config={avatar}
            mood="relaxing"
            animated={settings.avatarAnimations && !settings.reducedMotion}
            size="md"
          />
        </div>

        <div className="flex-1 text-center sm:text-start">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2A2724] dark:text-[#F7F4EE]">
            {avatar.name || "Friend"}
          </h1>
          <p className="text-sm text-[#6C665F] dark:text-[#C8C2B8] mt-1">
            {tr.taglineFull}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-4">
            <button
              type="button"
              onClick={onCustomizeAvatar}
              className="min-h-[44px] px-5 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold"
            >
              {tr.customizeAvatarRoom}
            </button>
            <button
              type="button"
              onClick={() => onOpenSubView("money")}
              className="min-h-[44px] px-4 rounded-2xl bg-white/85 dark:bg-black/25 border border-[#DFD8CA] dark:border-white/15 text-sm font-semibold inline-flex items-center gap-2"
            >
              <MoneyIcon className="w-5 h-5" />
              <span>{tr.moneyTitle}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Lightweight Life Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { view: "birthdays" as SubView, label: tr.tileBirthdays },
          { view: "gifts" as SubView, label: tr.tileGifts },
          { view: "places" as SubView, label: tr.tilePlaces },
          { view: "pack" as SubView, label: tr.tilePack },
          { view: "automations" as SubView, label: tr.tileAutomations },
        ].map((item) => (
          <button
            key={item.view}
            type="button"
            onClick={() => onOpenSubView(item.view)}
            className="min-h-[44px] px-3 rounded-2xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 text-xs font-semibold hover:bg-[#FAF6EC] dark:hover:bg-[#323036]"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Habits, Personal Goals, Achievements */}
        <div className="md:col-span-6 lg:col-span-7 space-y-6">
          <section className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <SelfCareIcon className="w-7 h-7" />
              <div>
                <h2 className="font-display text-lg font-bold">{tr.myHabits}</h2>
                <p className="text-xs text-[#6C665F] dark:text-[#B6AFA6]">
                  {tr.habitsSub}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {habits.map((habit) => {
                const pct = Math.min(
                  100,
                  Math.round((habit.completedCountThisWeek / Math.max(1, habit.targetPerWeek)) * 100)
                );
                return (
                  <div
                    key={habit.id}
                    className={`rounded-2xl border p-3.5 space-y-2 ${PASTEL_CARD_CLASSES[habit.pastel]}`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onToggleHabit(habit.id)}
                        className={`min-w-[42px] min-h-[42px] rounded-2xl border flex items-center justify-center shrink-0 ${
                          habit.completedToday
                            ? "bg-[#4A7C59] border-[#4A7C59] text-white"
                            : "bg-white/85 dark:bg-black/20 border-[#CFC8BC]"
                        }`}
                      >
                        {habit.completedToday && <Check className="w-5 h-5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${habit.completedToday ? "opacity-75" : ""}`}>
                          {habit.title}
                        </p>
                        <p className="text-xs text-[#6C665F] dark:text-[#C8C2B8]">
                          {tr.habitFrequencies[habit.frequency]} ·{" "}
                          {fmt(tr.thisWeekProgress, {
                            done: formatLocaleNumber(habit.completedCountThisWeek, settings.language, settings.region),
                            target: formatLocaleNumber(habit.targetPerWeek, settings.language, settings.region),
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/75 dark:bg-black/25 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#669977] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newHabit.trim()) return;
                onAddHabit(newHabit.trim(), newHabitFreq);
                setNewHabit("");
              }}
              className="flex flex-wrap gap-2 pt-1"
            >
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder={tr.addHabitPlaceholder}
                className="flex-1 min-w-[160px] min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
              />
              <select
                value={newHabitFreq}
                onChange={(e) => setNewHabitFreq(e.target.value as HabitItem["frequency"])}
                className="min-h-[44px] px-3 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-xs font-semibold"
              >
                {(Object.keys(tr.habitFrequencies) as HabitItem["frequency"][]).map((freq) => (
                  <option key={freq} value={freq}>
                    {tr.habitFrequencies[freq]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                aria-label={tr.add}
                className="min-w-[44px] min-h-[44px] px-4 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724] flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>
          </section>

          {/* My Goals 🎯 */}
          <section className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GoalsIcon className="w-7 h-7" />
                <h2 className="font-display text-lg font-bold">{tr.myGoals}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowGoalForm((v) => !v)}
                className="min-h-[44px] px-3.5 rounded-xl bg-[#FAF6EC] dark:bg-[#323036] text-xs font-semibold inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> {tr.newGoal}
              </button>
            </div>

            {showGoalForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!goalTitle.trim()) return;
                  const steps = goalStepsText
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  onAddPersonalGoal(
                    goalTitle.trim(),
                    goalDesc.trim(),
                    goalDate,
                    steps.length > 0 ? steps : [goalTitle.trim()]
                  );
                  setGoalTitle("");
                  setGoalDesc("");
                  setGoalDate("");
                  setGoalStepsText("");
                  setShowGoalForm(false);
                }}
                className="rounded-2xl bg-[#FAF8F4] dark:bg-[#1E1C21] p-4 space-y-2.5 border border-[#E5DFD3] dark:border-white/10"
              >
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder={tr.goalTitlePlaceholder}
                  className="w-full min-h-[42px] px-3.5 rounded-xl bg-white dark:bg-[#27252A] border border-[#E5DFD3] dark:border-white/10 text-sm"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={goalDesc}
                    onChange={(e) => setGoalDesc(e.target.value)}
                    placeholder={tr.goalDescPlaceholder}
                    className="min-h-[42px] px-3.5 rounded-xl bg-white dark:bg-[#27252A] border border-[#E5DFD3] dark:border-white/10 text-sm"
                  />
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="min-h-[42px] px-3.5 rounded-xl bg-white dark:bg-[#27252A] border border-[#E5DFD3] dark:border-white/10 font-mono-num text-sm"
                  />
                </div>
                <input
                  type="text"
                  value={goalStepsText}
                  onChange={(e) => setGoalStepsText(e.target.value)}
                  placeholder={tr.goalStepsPlaceholder}
                  className="w-full min-h-[42px] px-3.5 rounded-xl bg-white dark:bg-[#27252A] border border-[#E5DFD3] dark:border-white/10 text-sm"
                />
                <button
                  type="submit"
                  className="min-h-[42px] px-4 rounded-xl bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724] text-xs font-semibold"
                >
                  {tr.savePersonalGoal}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {personalGoals.map((goal) => {
                const doneSteps = goal.steps.filter((s) => s.done).length;
                const pct =
                  goal.steps.length > 0
                    ? Math.round((doneSteps / goal.steps.length) * 100)
                    : goal.manualProgress ?? 0;

                return (
                  <div
                    key={goal.id}
                    className={`rounded-2xl border p-4 space-y-2.5 ${PASTEL_CARD_CLASSES[goal.pastel]}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-base font-bold">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-xs text-[#5C564F] dark:text-[#C8C2B8]">{goal.description}</p>
                        )}
                      </div>
                      <span className="font-mono-num text-sm font-bold text-[#4A7C59] dark:text-[#A9D6B6]">
                        {formatLocaleNumber(pct, settings.language, settings.region)}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-white/80 dark:bg-black/25 overflow-hidden">
                      <div className="h-full rounded-full bg-[#669977] transition-all" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {goal.steps.map((step) => (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => onToggleGoalStep(goal.id, step.id)}
                          className="w-full min-h-[36px] px-2.5 rounded-xl bg-white/75 dark:bg-black/20 flex items-center gap-2.5 text-start text-xs font-medium"
                        >
                          <span
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                              step.done
                                ? "bg-[#4A7C59] border-[#4A7C59] text-white"
                                : "bg-white dark:bg-[#27252A] border-[#CFC8BC]"
                            }`}
                          >
                            {step.done && <Check className="w-3 h-3" />}
                          </span>
                          <span className={step.done ? "line-through opacity-60" : ""}>{step.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Achievements 🏆 */}
          <section className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-3">
            <h2 className="font-display text-lg font-bold">{tr.achievementsTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-2xl border p-3 flex items-center gap-3 ${
                    a.earned
                      ? "bg-[#FDF3CD]/80 dark:bg-[#38321F] border-[#F2E09E]"
                      : "bg-[#FAF8F4] dark:bg-[#1E1C21] border-[#EAE4D8] dark:border-white/10 opacity-55"
                  }`}
                >
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <p className="text-xs font-bold">{a.title}</p>
                    <p className="text-[11px] text-[#6C665F] dark:text-[#C8C2B8]">
                      {a.earned ? tr.unlockedLabel : tr.keepGoingGently}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Install App, Personalization, Language/Region/Currency, Security */}
        <div className="md:col-span-6 lg:col-span-5 space-y-5">
          <PWAInstallCard language={settings.language} />
          <section className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-4">
            <h2 className="font-display text-lg font-bold">{tr.personalizationTitle}</h2>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: "day" })}
                className={`min-h-[44px] rounded-2xl border text-sm font-semibold ${
                  settings.theme === "day"
                    ? "bg-[#FDF1C7] border-[#DFC97B] text-[#2A2724]"
                    : "bg-[#FAF8F4] dark:bg-[#1E1C21] border-[#E5DFD3] dark:border-white/10 text-[#6C665F]"
                }`}
              >
                {tr.softDay}
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: "dusk" })}
                className={`min-h-[44px] rounded-2xl border text-sm font-semibold ${
                  settings.theme === "dusk"
                    ? "bg-[#2D273B] border-[#6E569E] text-[#F7F4EE]"
                    : "bg-[#FAF8F4] dark:bg-[#1E1C21] border-[#E5DFD3] dark:border-white/10 text-[#6C665F]"
                }`}
              >
                {tr.cozyDusk}
              </button>
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#6C665F] mb-2">
                {tr.appAccentColor}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {(Object.keys(ACCENT_THEMES) as AccentColorKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-label={ACCENT_THEMES[key].label}
                    onClick={() => onUpdateSettings({ accentColor: key })}
                    className={`w-10 h-10 rounded-full border-2 ${
                      settings.accentColor === key ? "border-[#2A2724] dark:border-white scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: ACCENT_THEMES[key].bg }}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#6C665F] mb-1.5">
                {tr.homeCardArrangement}
              </span>
              <div className="space-y-1.5">
                {settings.homeCardOrder.map((cardId, idx) => {
                  const hidden = settings.hiddenHomeCards.includes(cardId);
                  return (
                    <div
                      key={cardId}
                      className="rounded-xl bg-[#FAF8F4] dark:bg-[#1E1C21] px-3 py-2 flex items-center justify-between gap-2 text-xs font-semibold"
                    >
                      <span className={hidden ? "opacity-50 line-through" : ""}>
                        {tr.homeCardLabels[cardId]}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveHomeCard(idx, -1)}
                          aria-label="Move up"
                          className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveHomeCard(idx, 1)}
                          aria-label="Move down"
                          className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleHideCard(cardId)}
                          aria-label={hidden ? "Show" : tr.hide}
                          className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settings -> Language Row (Opens Dedicated Language Selection Screen) */}
            <div>
              <span className="block text-xs font-semibold text-[#6C665F] mb-1">
                {tr.languageLabel}
              </span>
              <button
                type="button"
                onClick={() => onOpenSubView("language")}
                className="w-full min-h-[48px] px-3.5 rounded-2xl bg-[#FDF3CD]/60 dark:bg-[#38321F] border border-[#EFE0A4] dark:border-white/10 flex items-center justify-between gap-3 hover:opacity-95 transition-opacity"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Globe className="w-4 h-4 text-[#6E569E] dark:text-[#FDF1C7] shrink-0" />
                  <span className="text-lg shrink-0" aria-hidden="true">{langMeta.flag}</span>
                  <span className="text-sm font-bold text-[#2A2724] dark:text-[#F7F4EE] truncate">
                    {langMeta.nativeName}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6C665F] dark:text-[#C8C2B8] rtl:rotate-180 shrink-0" />
              </button>
            </div>

            {/* Separate Region & Currency Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#6C665F] mb-1">
                  {tr.regionLabel}
                </label>
                <select
                  value={settings.region}
                  onChange={(e) => onUpdateSettings({ region: e.target.value as AppRegion })}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#FAF8F4] dark:bg-[#1E1C21] border border-[#E5DFD3] dark:border-white/10 text-xs font-semibold"
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6C665F] mb-1">
                  {tr.currencyLabel}
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    onUpdateSettings({ currency: e.target.value as AppSettings["currency"] })
                  }
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#FAF8F4] dark:bg-[#1E1C21] border border-[#E5DFD3] dark:border-white/10 text-xs font-semibold"
                >
                  <option value="IQD">IQD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#6C665F] mb-1.5">
                {tr.textSizeLabel}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "standard", label: tr.textStandard },
                    { id: "large", label: tr.textLarge },
                    { id: "xlarge", label: tr.textExtra },
                  ] as { id: TextScale; label: string }[]
                ).map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => onUpdateSettings({ textScale: sz.id })}
                    className={`min-h-[40px] rounded-xl border text-xs font-semibold ${
                      settings.textScale === sz.id
                        ? "bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724]"
                        : "bg-[#FAF8F4] dark:bg-[#1E1C21] border-[#E5DFD3]"
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Privacy, Security & Location */}
          <section className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#6E569E]" />
              <h2 className="font-display text-lg font-bold">{tr.privacySecurityTitle}</h2>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{tr.appLockTitle}</p>
                <p className="text-xs text-[#6C665F]">{tr.appLockSub}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.appLockEnabled}
                onClick={() => onUpdateSettings({ appLockEnabled: !settings.appLockEnabled })}
                className={`min-w-[50px] min-h-[32px] rounded-full p-1 transition-colors shrink-0 ${
                  settings.appLockEnabled ? "bg-[#669977]" : "bg-[#D8D2C8]"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.appLockEnabled ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {settings.appLockEnabled && (
              <div className="rounded-2xl bg-[#FAF8F4] dark:bg-[#1E1C21] p-3 space-y-2">
                <label className="block text-xs font-semibold text-[#6C665F]">{tr.pin4Digit}</label>
                <input
                  type="password"
                  maxLength={4}
                  value={settings.appLockPin}
                  onChange={(e) => onUpdateSettings({ appLockPin: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  className="w-32 min-h-[40px] px-3 rounded-xl bg-white dark:bg-[#27252A] border border-[#E5DFD3] font-mono-num text-sm"
                />
                <label className="flex items-center gap-2 text-xs font-medium pt-1">
                  <input
                    type="checkbox"
                    checked={settings.biometricEnabled}
                    onChange={(e) => onUpdateSettings({ biometricEnabled: e.target.checked })}
                  />
                  <span>{tr.biometricLabel}</span>
                </label>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#6C665F] mb-1">
                {tr.weatherLocationMode}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={settings.locationPermission}
                  onChange={(e) =>
                    onUpdateSettings({
                      locationPermission: e.target.value as AppSettings["locationPermission"],
                    })
                  }
                  className="min-h-[40px] px-3 rounded-xl bg-[#FAF8F4] dark:bg-[#1E1C21] border border-[#E5DFD3] text-xs font-semibold"
                >
                  <option value="unset">{tr.askOnHome}</option>
                  <option value="granted">{tr.deviceLocation}</option>
                  <option value="manual">{tr.manualCityOpt}</option>
                </select>
                <select
                  value={settings.manualCity}
                  onChange={(e) =>
                    onUpdateSettings({ locationPermission: "manual", manualCity: e.target.value })
                  }
                  className="min-h-[40px] px-3 rounded-xl bg-[#FAF8F4] dark:bg-[#1E1C21] border border-[#E5DFD3] text-xs font-semibold"
                >
                  {MANUAL_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{tr.notificationsChimes}</span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.reminderChimes}
                onClick={() => onUpdateSettings({ reminderChimes: !settings.reminderChimes })}
                className={`min-w-[50px] min-h-[32px] rounded-full p-1 transition-colors shrink-0 ${
                  settings.reminderChimes ? "bg-[#669977]" : "bg-[#D8D2C8]"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.reminderChimes ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{tr.reducedMotion}</span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.reducedMotion}
                onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
                className={`min-w-[50px] min-h-[32px] rounded-full p-1 transition-colors shrink-0 ${
                  settings.reducedMotion ? "bg-[#669977]" : "bg-[#D8D2C8]"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.reducedMotion ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Data Export & Delete Account */}
            <div className="pt-2 border-t border-[#EFEAE0] dark:border-white/10 space-y-2">
              <button
                type="button"
                onClick={onExportData}
                className="w-full min-h-[44px] rounded-2xl bg-[#E3F1FA] dark:bg-[#21303B] text-xs font-semibold text-[#1F3A4D] dark:text-[#E3F1FA] inline-flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{tr.exportDataBtn}</span>
              </button>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full min-h-[44px] rounded-2xl bg-[#FCEAF0] dark:bg-[#39252D] text-xs font-semibold text-[#8C374C] dark:text-[#FFD6E1]"
                >
                  {tr.deleteAccountBtn}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDelete(false);
                      onResetApp();
                    }}
                    className="flex-1 min-h-[44px] rounded-2xl bg-[#9E475B] text-white text-xs font-semibold"
                  >
                    {tr.confirmDeleteBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 min-h-[44px] rounded-2xl bg-[#F3EFE7] dark:bg-[#1E1C21] text-xs font-semibold"
                  >
                    {tr.cancel}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
