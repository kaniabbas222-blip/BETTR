import React, { useEffect, useState } from "react";
import { ArrowRight, Check, Loader2, MapPin, Plus } from "lucide-react";
import { MANUAL_CITIES, PASTEL_CARD_CLASSES, getTodayISO } from "../data/defaults";
import {
  fmt,
  formatLocaleDate,
  formatLocaleNumber,
  getLanguageMeta,
  getLocalizedWeatherText,
  t,
} from "../i18n/translations";
import type {
  AppLanguage,
  AppSettings,
  AvatarConfig,
  BirthdayPerson,
  HomeCardId,
  MoodEntry,
  MoodLevel,
  RoomConfig,
  SubView,
  TaskItem,
  WeatherSnapshot,
} from "../types/butter";
import type { AvatarMood } from "./AvatarCanvas";
import { AvatarRoomScene } from "./AvatarRoomScene";
import {
  CategoryIcon,
  MagicWandIcon,
  MoneyIcon,
  NotesIcon,
  ReminderIcon,
  ShoppingIcon,
  WeatherIcon,
} from "./CuteIcons";

interface HomeScreenProps {
  avatar: AvatarConfig;
  room: RoomConfig;
  tasks: TaskItem[];
  birthdays: BirthdayPerson[];
  moods: MoodEntry[];
  settings: AppSettings;
  onToggleTask: (id: string) => void;
  onQuickAdd: (mode: "task" | "reminder") => void;
  onOpenShopping: () => void;
  onOpenSubView: (view: SubView) => void;
  onOpenAskButter: () => void;
  onGoToPlan: () => void;
  onCustomizeAvatar: () => void;
  onLogMood: (mood: MoodLevel, note: string) => void;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
}

function getGreeting(language: AppLanguage): string {
  const tr = t(language);
  const hour = new Date().getHours();
  if (hour < 12) return tr.greetingMorning;
  if (hour < 17) return tr.greetingAfternoon;
  return tr.greetingEvening;
}

function computeAvatarState(
  tasks: TaskItem[],
  avatar: AvatarConfig,
  language: AppLanguage
): { mood: AvatarMood; caption: string } {
  const tr = t(language);
  const todayTasks = tasks.filter((tItem) => tItem.bucket === "today");
  const completedCount = todayTasks.filter((tItem) => tItem.completed).length;
  const openTasks = todayTasks.filter((tItem) => !tItem.completed);

  if (completedCount >= 2 && (openTasks.length === 0 || completedCount >= openTasks.length)) {
    return {
      mood: "celebrating",
      caption: fmt(tr.captionCelebrating, {
        count: formatLocaleNumber(completedCount, language, "auto"),
      }),
    };
  }
  if (openTasks.some((tItem) => tItem.category === "school" || tItem.category === "homework")) {
    return { mood: "studying", caption: tr.captionStudying };
  }
  if (openTasks.some((tItem) => tItem.category === "shopping" || tItem.category === "errand")) {
    return { mood: "shopping", caption: tr.captionShopping };
  }
  if (openTasks.some((tItem) => tItem.category === "selfcare")) {
    return { mood: "selfcare", caption: tr.captionSelfcare };
  }
  if (avatar.headphones === "pastel") {
    return { mood: "music", caption: tr.captionMusic };
  }
  return { mood: "relaxing", caption: tr.captionRelaxing };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  avatar,
  room,
  tasks,
  birthdays,
  moods,
  settings,
  onToggleTask,
  onQuickAdd,
  onOpenShopping,
  onOpenSubView,
  onOpenAskButter,
  onGoToPlan,
  onCustomizeAvatar,
  onLogMood,
  onUpdateSettings,
}) => {
  const tr = t(settings.language);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [easyOrderLoading, setEasyOrderLoading] = useState(false);
  const [easyOrderResult, setEasyOrderResult] = useState<{
    summary: string;
    orderedSteps: { title: string; suggestedWindow: string; tip: string }[];
  } | null>(null);
  const [easyOrderError, setEasyOrderError] = useState<string | null>(null);

  const [windDownChecks, setWindDownChecks] = useState<Record<string, boolean>>({
    bag: false,
    charge: false,
    schedule: false,
  });
  const [moodNote, setMoodNote] = useState("");

  const moodOptions: { id: MoodLevel; emoji: string; label: string }[] = [
    { id: "great", emoji: "😊", label: tr.moodGreat },
    { id: "good", emoji: "🙂", label: tr.moodGood },
    { id: "okay", emoji: "😐", label: tr.moodOkay },
    { id: "tired", emoji: "😴", label: tr.moodTired },
    { id: "low", emoji: "😕", label: tr.moodLow },
  ];

  const todayISO = getTodayISO();
  const todayTasks = tasks.filter((tItem) => tItem.bucket === "today");
  const tomorrowTasks = tasks.filter((tItem) => tItem.bucket === "tomorrow");
  const importantReminders = tasks.filter((tItem) => tItem.reminder && !tItem.completed).slice(0, 2);
  const { mood, caption } = computeAvatarState(tasks, avatar, settings.language);
  const todayMood = moods.find((m) => m.dateISO === todayISO);

  const upcomingBirthdays = birthdays.filter((b) => {
    const [m, d] = b.dateMM_DD.split("-").map(Number);
    if (!m || !d) return false;
    const now = new Date();
    const bDate = new Date(now.getFullYear(), m - 1, d);
    const diffDays = Math.ceil((bDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const fetchWeatherByCoords = async (lat: number, lon: number, cityLabel: string) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || tr.weatherUnavailable);
      setWeather({
        ...data,
        weatherCode: typeof data.weatherCode === "number" ? data.weatherCode : 0,
        cityLabel,
      });
    } catch (err: unknown) {
      setWeatherError(err instanceof Error ? err.message : tr.weatherUnavailable);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    if (settings.locationPermission === "manual") {
      const city = MANUAL_CITIES.find((c) => c.name === settings.manualCity) || MANUAL_CITIES[0];
      fetchWeatherByCoords(city.lat, city.lon, city.name);
    } else if (settings.locationPermission === "granted" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, "GPS"),
        () => setWeatherError(tr.weatherUnavailable)
      );
    }
  }, [settings.locationPermission, settings.manualCity]);

  const handleEnableDeviceLocation = () => {
    if (!("geolocation" in navigator)) {
      onUpdateSettings({ locationPermission: "manual" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onUpdateSettings({ locationPermission: "granted" });
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, "GPS");
      },
      () => {
        onUpdateSettings({ locationPermission: "manual" });
      }
    );
  };

  const handleMakeDayEasier = async () => {
    const open = todayTasks.filter((tItem) => !tItem.completed);
    setEasyOrderLoading(true);
    setEasyOrderError(null);
    try {
      const res = await fetch("/api/make-day-easier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: open,
          language: getLanguageMeta(settings.language).englishName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || tr.errorGeneric);
      setEasyOrderResult(data);
    } catch (err: unknown) {
      setEasyOrderError(err instanceof Error ? err.message : tr.errorGeneric);
    } finally {
      setEasyOrderLoading(false);
    }
  };

  const isCardVisible = (id: HomeCardId) => !settings.hiddenHomeCards.includes(id);

  const localizedWeather = weather
    ? getLocalizedWeatherText(weather.weatherCode ?? 0, weather.tempC, settings.language)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Greeting + Current Date */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#6C665F] dark:text-[#B6AFA6]">
            {formatLocaleDate(new Date(), settings.language, settings.region, "full")}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2A2724] dark:text-[#F7F4EE] mt-0.5">
            {getGreeting(settings.language)} 🫧
          </h1>
          <p className="text-sm text-[#6C665F] dark:text-[#B6AFA6]">
            {avatar.name
              ? fmt(tr.homePromptNamed, { name: avatar.name })
              : tr.homePromptDefault}
          </p>
        </div>

        {/* Upcoming Birthday Highlight */}
        {upcomingBirthdays.length > 0 && (
          <button
            type="button"
            onClick={() => onOpenSubView("birthdays")}
            className="min-h-[44px] px-4 rounded-2xl bg-[#FCEAF0] dark:bg-[#39252D] border border-[#F2CEDB] dark:border-[#523440] text-xs sm:text-sm font-semibold text-[#6E273A] dark:text-[#FFD6E1] text-start"
          >
            {fmt(tr.upcomingBirthdayChip, {
              name: upcomingBirthdays[0].name,
              date: upcomingBirthdays[0].dateMM_DD,
            })}
          </button>
        )}
      </div>

      {/* Main Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="md:col-span-5 space-y-5">
          {settings.homeCardOrder
            .filter((id) => (id === "avatar" || id === "weather" || id === "mood") && isCardVisible(id))
            .map((cardId) => {
              if (cardId === "avatar") {
                return (
                  <div
                    key="avatar"
                    className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#E6E1D6] dark:border-white/10 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-[#5C564F] dark:text-[#C5BFB6]">
                        {caption}
                      </span>
                      <button
                        type="button"
                        onClick={onCustomizeAvatar}
                        className="min-h-[44px] px-3.5 rounded-xl bg-[#FAF6EC] dark:bg-[#323036] text-xs font-semibold text-[#2A2724] dark:text-[#F7F4EE] shrink-0"
                      >
                        {tr.editRoom}
                      </button>
                    </div>
                    <AvatarRoomScene
                      avatar={avatar}
                      room={room}
                      mood={mood}
                      animated={settings.avatarAnimations && !settings.reducedMotion}
                    />
                  </div>
                );
              }
              if (cardId === "weather") {
                return (
                  <section
                    key="weather"
                    className="rounded-3xl bg-[#E3F1FA]/85 dark:bg-[#21303B] border border-[#C5E0F2] dark:border-[#304554] p-4 sm:p-5"
                  >
                    {settings.locationPermission === "unset" ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <WeatherIcon className="w-9 h-9 shrink-0" />
                          <div>
                            <h2 className="font-display text-base font-bold text-[#2A2724] dark:text-[#F7F4EE]">
                              {tr.localWeather}
                            </h2>
                            <p className="text-xs text-[#5C564F] dark:text-[#C5BFB6]">
                              {tr.weatherPrompt}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={handleEnableDeviceLocation}
                            className="min-h-[44px] px-3.5 rounded-xl bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724] text-xs font-semibold inline-flex items-center gap-1.5"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{tr.useLocation}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ locationPermission: "manual" })}
                            className="min-h-[44px] px-3.5 rounded-xl bg-white/85 dark:bg-black/20 text-xs font-semibold text-[#2A2724] dark:text-[#F7F4EE]"
                          >
                            {tr.chooseCity}
                          </button>
                        </div>
                      </div>
                    ) : weatherLoading ? (
                      <div className="flex items-center gap-2 text-sm text-[#5C564F] dark:text-[#C8C2B8]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{tr.checkingSky}</span>
                      </div>
                    ) : weatherError ? (
                      <div className="space-y-2">
                        <p className="text-xs text-[#6E273A] dark:text-[#FFD6E1]">{weatherError}</p>
                        <select
                          value={settings.manualCity}
                          onChange={(e) =>
                            onUpdateSettings({ locationPermission: "manual", manualCity: e.target.value })
                          }
                          className="min-h-[44px] px-3 rounded-xl bg-white dark:bg-[#1B191E] text-xs font-semibold"
                        >
                          {MANUAL_CITIES.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : weather && localizedWeather ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-3xl">{weather.emoji}</span>
                            <div>
                              <p className="font-mono-num text-xl font-bold text-[#2A2724] dark:text-[#F7F4EE]">
                                {formatLocaleNumber(weather.tempC, settings.language, settings.region)}°C ·{" "}
                                {localizedWeather.condition}
                              </p>
                              <p className="text-xs text-[#5C564F] dark:text-[#C5BFB6]">
                                {weather.cityLabel} ·{" "}
                                {fmt(tr.weatherHighLow, {
                                  hi: formatLocaleNumber(weather.hiC, settings.language, settings.region),
                                  lo: formatLocaleNumber(weather.loC, settings.language, settings.region),
                                })}
                              </p>
                            </div>
                          </div>
                          {settings.locationPermission === "manual" && (
                            <select
                              aria-label={tr.chooseCity}
                              value={settings.manualCity}
                              onChange={(e) => onUpdateSettings({ manualCity: e.target.value })}
                              className="min-h-[44px] px-2.5 rounded-xl bg-white/80 dark:bg-black/25 text-xs font-semibold"
                            >
                              {MANUAL_CITIES.map((c) => (
                                <option key={c.name} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-[#2A2724] dark:text-[#E3F1FA]">
                          “{localizedWeather.advice}”
                        </p>
                      </div>
                    ) : null}
                  </section>
                );
              }
              return (
                <section
                  key="mood"
                  className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-bold text-[#2A2724] dark:text-[#F7F4EE]">
                      {tr.moodTitle}
                    </h2>
                    <div className="flex items-center gap-1.5">
                      {moods.slice(-5).map((m) => (
                        <span key={m.id} className="text-sm">
                          {moodOptions.find((o) => o.id === m.mood)?.emoji || "🫧"}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {moodOptions.map((opt) => {
                      const selected = todayMood?.mood === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            onLogMood(opt.id, moodNote);
                            setMoodNote("");
                          }}
                          className={`min-h-[54px] rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                            selected
                              ? "bg-[#FDF1C7] dark:bg-[#4F472B] border-[#DFC97B]"
                              : "bg-[#FAF8F4] dark:bg-[#1E1C21] border-[#EAE4D8] dark:border-white/10"
                          }`}
                        >
                          <span className="text-lg">{opt.emoji}</span>
                          <span className="text-[10px] font-semibold text-[#5C564F] dark:text-[#C8C2B8]">
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    placeholder={tr.moodNotePlaceholder}
                    className="w-full min-h-[44px] px-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#EAE4D8] dark:border-white/10 text-xs sm:text-sm"
                  />
                </section>
              );
            })}
        </div>

        {/* Right Column */}
        <div className="md:col-span-7 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            <button
              type="button"
              onClick={() => onQuickAdd("task")}
              className="min-h-[78px] p-2.5 rounded-2xl bg-[#FAF6EB] dark:bg-[#2C2A24] border border-[#EAE2CE] dark:border-white/10 flex flex-col items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-transform"
            >
              <NotesIcon className="w-7 h-7" active />
              <span className="text-xs font-semibold text-center leading-tight">{tr.quickAdd}</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickAdd("reminder")}
              className="min-h-[78px] p-2.5 rounded-2xl bg-[#FCEAF0] dark:bg-[#38262D] border border-[#F2CEDB] dark:border-white/10 flex flex-col items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-transform"
            >
              <ReminderIcon className="w-7 h-7" />
              <span className="text-xs font-semibold text-center leading-tight">{tr.quickReminder}</span>
            </button>
            <button
              type="button"
              onClick={onOpenShopping}
              className="min-h-[78px] p-2.5 rounded-2xl bg-[#FDF3CD] dark:bg-[#38321F] border border-[#F2E09E] dark:border-white/10 flex flex-col items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-transform"
            >
              <ShoppingIcon className="w-7 h-7" />
              <span className="text-xs font-semibold text-center leading-tight">{tr.quickList}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenSubView("money")}
              className="min-h-[78px] p-2.5 rounded-2xl bg-[#E6F1E9] dark:bg-[#24332A] border border-[#C9E0D0] dark:border-white/10 flex flex-col items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-transform"
            >
              <MoneyIcon className="w-7 h-7" />
              <span className="text-xs font-semibold text-center leading-tight">{tr.quickMoney}</span>
            </button>
            <button
              type="button"
              onClick={onOpenAskButter}
              className="col-span-2 sm:col-span-1 min-h-[78px] p-2.5 rounded-2xl bg-[#EFEAF9] dark:bg-[#2D273B] border border-[#DACFF0] dark:border-white/10 flex flex-col items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-transform"
            >
              <MagicWandIcon className="w-7 h-7" />
              <span className="text-xs font-semibold text-center leading-tight">{tr.quickAskButter}</span>
            </button>
          </div>

          {/* Your Day & Wind Down */}
          {settings.homeCardOrder
            .filter((id) => (id === "your-day" || id === "wind-down") && isCardVisible(id))
            .map((cardId) =>
              cardId === "your-day" ? (
                <section key="your-day" className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-bold text-[#2A2724] dark:text-[#F7F4EE]">
                      {tr.yourDay}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={easyOrderLoading}
                        onClick={handleMakeDayEasier}
                        className="min-h-[44px] px-3.5 rounded-2xl bg-[#EFEAF9] dark:bg-[#2D273B] border border-[#DACFF0] dark:border-white/10 text-xs font-semibold text-[#4C3B6E] dark:text-[#DCD2F2] inline-flex items-center gap-1.5"
                      >
                        {easyOrderLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>✨</span>}
                        <span>{tr.makeDayEasier}</span>
                      </button>
                      <button
                        type="button"
                        onClick={onGoToPlan}
                        className="min-h-[44px] px-3 text-xs font-semibold text-[#6C665F] dark:text-[#C5BFB6] inline-flex items-center gap-1"
                      >
                        <span>{tr.fullPlan}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>

                  {easyOrderError && (
                    <div className="rounded-2xl bg-[#FCE6EC] dark:bg-[#492832] p-3.5 text-xs text-[#6E273A] dark:text-[#FFD6E1]">
                      {easyOrderError}
                    </div>
                  )}

                  {easyOrderResult && (
                    <div className="rounded-3xl bg-[#EFEAF9]/80 dark:bg-[#2D273B] border border-[#DACFF0] dark:border-white/10 p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#4C3B6E] dark:text-[#DCD2F2]">
                          {tr.gentleSuggestedOrder}
                        </p>
                        <button
                          type="button"
                          onClick={() => setEasyOrderResult(null)}
                          className="text-xs font-semibold text-[#6C665F]"
                        >
                          {tr.hide}
                        </button>
                      </div>
                      <p className="text-sm text-[#2A2724] dark:text-[#F7F4EE]">{easyOrderResult.summary}</p>
                      <div className="space-y-1.5">
                        {easyOrderResult.orderedSteps?.map((step, i) => (
                          <div
                            key={i}
                            className="rounded-2xl bg-white/80 dark:bg-black/20 px-3.5 py-2.5 text-xs"
                          >
                            <p className="font-semibold text-[#2A2724] dark:text-[#F7F4EE]">
                              {formatLocaleNumber(i + 1, settings.language, settings.region)}. {step.title} ·{" "}
                              <span className="text-[#6C665F]">{step.suggestedWindow}</span>
                            </p>
                            <p className="text-[#6C665F] dark:text-[#C8C2B8] mt-0.5">{step.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {todayTasks.length === 0 ? (
                    <div className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#ECE7DD] dark:border-white/10 p-6 text-center">
                      <p className="text-sm text-[#6C665F] dark:text-[#B6AFA6]">
                        {tr.nothingScheduledToday}
                      </p>
                      <button
                        type="button"
                        onClick={() => onQuickAdd("task")}
                        className="mt-3 min-h-[44px] px-4 rounded-2xl bg-[#FDF1C7] text-[#2A2724] text-sm font-semibold inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{tr.addFirstPlan}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {todayTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`rounded-2xl border p-3.5 flex items-center gap-3.5 transition-all ${
                            PASTEL_CARD_CLASSES[task.pastel]
                          } ${task.completed ? "opacity-65" : ""}`}
                        >
                          <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-black/20 flex items-center justify-center shrink-0">
                            <CategoryIcon category={task.category} className="w-7 h-7" />
                          </div>
                          <div className="min-w-0 flex-1">
                            {task.timeLabel && (
                              <p className="text-xs font-semibold text-[#6C665F] dark:text-[#C8C2B8] font-mono-num">
                                {task.timeLabel}
                                {task.reminderSchedule === "location" ? ` · ${tr.placeAlertTag}` : ""}
                              </p>
                            )}
                            <p
                              className={`text-base font-semibold text-[#2A2724] dark:text-[#F7F4EE] truncate ${
                                task.completed ? "line-through" : ""
                              }`}
                            >
                              {task.title}
                            </p>
                          </div>
                          {task.reminder && !task.completed && (
                            <ReminderIcon className="w-5 h-5 shrink-0 opacity-80" />
                          )}
                          <button
                            type="button"
                            onClick={() => onToggleTask(task.id)}
                            aria-label={task.title}
                            className={`min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center border shrink-0 ${
                              task.completed
                                ? "bg-[#4A7C59] border-[#4A7C59] text-white"
                                : "bg-white/85 dark:bg-black/20 border-[#CFC8BC] dark:border-white/20 text-transparent"
                            }`}
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {importantReminders.length > 0 && (
                    <p className="text-xs text-[#6C665F] dark:text-[#B6AFA6] px-1">
                      {tr.activeRemindersLabel} {importantReminders.map((r) => r.title).join(" · ")}
                    </p>
                  )}
                </section>
              ) : (
                <section
                  key="wind-down"
                  className="rounded-3xl bg-[#EFEAF9]/60 dark:bg-[#282334] border border-[#DACFF0] dark:border-white/10 p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-base font-bold text-[#2A2724] dark:text-[#F7F4EE]">
                        {tr.windDown}
                      </h2>
                      <p className="text-xs text-[#6C665F] dark:text-[#C5BFB6]">
                        {fmt(tr.windDownTomorrowCount, {
                          count: formatLocaleNumber(tomorrowTasks.length, settings.language, settings.region),
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenSubView("pack")}
                      className="min-h-[44px] px-3.5 rounded-xl bg-white/80 dark:bg-black/20 text-xs font-semibold shrink-0"
                    >
                      {tr.packAndGo}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: "bag", label: tr.windDownBag },
                      { id: "charge", label: tr.windDownCharge },
                      { id: "schedule", label: tr.windDownSchedule },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setWindDownChecks((p) => ({ ...p, [item.id]: !p[item.id] }))
                        }
                        className={`min-h-[44px] px-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                          windDownChecks[item.id]
                            ? "bg-[#DCECE1] dark:bg-[#24332A] border-[#9CC2A8] line-through opacity-75"
                            : "bg-white/85 dark:bg-black/20 border-white/70 dark:border-white/10"
                        }`}
                      >
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )
            )}

          {/* Life Spaces Quick Launcher */}
          <section className="space-y-2.5">
            <h2 className="font-display text-sm font-bold text-[#6C665F] dark:text-[#B6AFA6]">
              {tr.exploreWorld}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5">
              {[
                { view: "pack" as SubView, label: tr.tilePack, bg: "bg-[#E3F1FA] dark:bg-[#21303B]" },
                { view: "places" as SubView, label: tr.tilePlaces, bg: "bg-[#E6F1E9] dark:bg-[#24332A]" },
                { view: "homecare" as SubView, label: tr.tileHomeCare, bg: "bg-[#FDF3CD] dark:bg-[#38321F]" },
                { view: "birthdays" as SubView, label: tr.tileBirthdays, bg: "bg-[#FCEAF0] dark:bg-[#39252D]" },
                { view: "gifts" as SubView, label: tr.tileGifts, bg: "bg-[#EFEAF9] dark:bg-[#2D273B]" },
                { view: "automations" as SubView, label: tr.tileAutomations, bg: "bg-[#FBF8F1] dark:bg-[#2E2C28]" },
              ].map((tile) => (
                <button
                  key={tile.view}
                  type="button"
                  onClick={() => onOpenSubView(tile.view)}
                  className={`min-h-[48px] px-3 py-2.5 rounded-2xl border border-black/5 dark:border-white/10 text-xs font-semibold text-[#2A2724] dark:text-[#F7F4EE] text-center hover:-translate-y-0.5 transition-transform ${tile.bg}`}
                >
                  {tile.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
