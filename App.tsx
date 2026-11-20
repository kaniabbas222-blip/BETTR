import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { AskButterModal } from "./components/AskButterModal";
import { AvatarStudio } from "./components/AvatarStudio";
import {
  AvatarNavIcon,
  BetterLogoIcon,
  HomeIcon,
  MagicWandIcon,
  NotesIcon,
  PlannerIcon,
} from "./components/CuteIcons";
import { HomeScreen } from "./components/HomeScreen";
import { LanguageSelector } from "./components/LanguageSelector";
import {
  AutomationsView,
  BirthdaysAndGiftsView,
  HomeCareView,
  PackAndGoView,
  PlacesView,
} from "./components/LifeSpacesHub";
import { MeScreen } from "./components/MeScreen";
import { MoneyScreen } from "./components/MoneyScreen";
import { NotesAndListsScreen, type NotesHubSection } from "./components/NotesAndListsScreen";
import { PlanScreen } from "./components/PlanScreen";
import { OfflineIndicator, PWAInstallBanner } from "./components/PWAComponents";
import { QuickAddModal } from "./components/QuickAddModal";
import { SplashAndOnboarding } from "./components/SplashAndOnboarding";
import {
  ACCENT_THEMES,
  DEFAULT_AUTOMATIONS,
  DEFAULT_AVATAR,
  DEFAULT_BIRTHDAYS,
  DEFAULT_EXPENSES,
  DEFAULT_GIFTS,
  DEFAULT_GOALS,
  DEFAULT_HABITS,
  DEFAULT_HOMECARE,
  DEFAULT_LISTS,
  DEFAULT_MEMORIES,
  DEFAULT_MOODS,
  DEFAULT_NOTES,
  DEFAULT_PACK_KITS,
  DEFAULT_PERSONAL_GOALS,
  DEFAULT_PLACES,
  DEFAULT_ROOM,
  DEFAULT_SETTINGS,
  DEFAULT_TASKS,
  DEFAULT_THINGS,
  getOffsetISO,
  getTodayISO,
} from "./data/defaults";
import {
  fmt,
  formatLocaleNumber,
  getLanguageMeta,
  normalizeLegacyLanguage,
  t,
} from "./i18n/translations";
import type {
  AppLanguage,
  AppSettings,
  AppStage,
  AvatarConfig,
  BirthdayPerson,
  ButterAutomation,
  CustomList,
  ExpenseItem,
  GiftPlan,
  HabitItem,
  HomeCareTask,
  MainTab,
  MemoryItem,
  MoodEntry,
  NoteItem,
  PackKit,
  ParsedButterItem,
  PastelTone,
  PersonalGoal,
  PersonalThing,
  RoomConfig,
  SavedPlace,
  SavingsGoal,
  SubView,
  TaskCategory,
  TaskItem,
} from "./types/butter";

const STORAGE_KEY = "better_companion_state_v1";

interface PersistedState {
  hasCompletedSetup: boolean;
  avatar: AvatarConfig;
  room: RoomConfig;
  tasks: TaskItem[];
  notes: NoteItem[];
  lists: CustomList[];
  packKits: PackKit[];
  places: SavedPlace[];
  homeCare: HomeCareTask[];
  birthdays: BirthdayPerson[];
  gifts: GiftPlan[];
  things: PersonalThing[];
  memories: MemoryItem[];
  moods: MoodEntry[];
  automations: ButterAutomation[];
  expenses: ExpenseItem[];
  goals: SavingsGoal[];
  personalGoals: PersonalGoal[];
  habits: HabitItem[];
  settings: AppSettings;
}

function loadInitialState(): PersistedState {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem("butter_companion_state_v2") ||
      localStorage.getItem("butter_companion_state_v1");
    if (raw) {
      const p = JSON.parse(raw) as Partial<PersistedState>;
      const mergedSettings: AppSettings = {
        ...DEFAULT_SETTINGS,
        ...(p.settings || {}),
        language: normalizeLegacyLanguage(p.settings?.language),
        region: p.settings?.region || "auto",
      };
      return {
        hasCompletedSetup: Boolean(p.hasCompletedSetup),
        avatar: { ...DEFAULT_AVATAR, ...(p.avatar || {}) },
        room: { ...DEFAULT_ROOM, ...(p.room || {}) },
        tasks: Array.isArray(p.tasks) ? p.tasks : DEFAULT_TASKS,
        notes: Array.isArray(p.notes) ? p.notes : DEFAULT_NOTES,
        lists: Array.isArray(p.lists) ? p.lists : DEFAULT_LISTS,
        packKits: Array.isArray(p.packKits) ? p.packKits : DEFAULT_PACK_KITS,
        places: Array.isArray(p.places) ? p.places : DEFAULT_PLACES,
        homeCare: Array.isArray(p.homeCare) ? p.homeCare : DEFAULT_HOMECARE,
        birthdays: Array.isArray(p.birthdays) ? p.birthdays : DEFAULT_BIRTHDAYS,
        gifts: Array.isArray(p.gifts) ? p.gifts : DEFAULT_GIFTS,
        things: Array.isArray(p.things) ? p.things : DEFAULT_THINGS,
        memories: Array.isArray(p.memories) ? p.memories : DEFAULT_MEMORIES,
        moods: Array.isArray(p.moods) ? p.moods : DEFAULT_MOODS,
        automations: Array.isArray(p.automations) ? p.automations : DEFAULT_AUTOMATIONS,
        expenses: Array.isArray(p.expenses) ? p.expenses : DEFAULT_EXPENSES,
        goals: Array.isArray(p.goals) ? p.goals : DEFAULT_GOALS,
        personalGoals: Array.isArray(p.personalGoals) ? p.personalGoals : DEFAULT_PERSONAL_GOALS,
        habits: Array.isArray(p.habits) ? p.habits : DEFAULT_HABITS,
        settings: mergedSettings,
      };
    }
  } catch {
    // ignore storage errors
  }
  return {
    hasCompletedSetup: false,
    avatar: DEFAULT_AVATAR,
    room: DEFAULT_ROOM,
    tasks: DEFAULT_TASKS,
    notes: DEFAULT_NOTES,
    lists: DEFAULT_LISTS,
    packKits: DEFAULT_PACK_KITS,
    places: DEFAULT_PLACES,
    homeCare: DEFAULT_HOMECARE,
    birthdays: DEFAULT_BIRTHDAYS,
    gifts: DEFAULT_GIFTS,
    things: DEFAULT_THINGS,
    memories: DEFAULT_MEMORIES,
    moods: DEFAULT_MOODS,
    automations: DEFAULT_AUTOMATIONS,
    expenses: DEFAULT_EXPENSES,
    goals: DEFAULT_GOALS,
    personalGoals: DEFAULT_PERSONAL_GOALS,
    habits: DEFAULT_HABITS,
    settings: DEFAULT_SETTINGS,
  };
}

function categoryToPastel(cat: TaskCategory): PastelTone {
  switch (cat) {
    case "school":
      return "sky";
    case "homework":
      return "lavender";
    case "shopping":
      return "yellow";
    case "selfcare":
      return "sage";
    case "errand":
      return "pink";
    default:
      return "cream";
  }
}

export default function App() {
  const [initial] = useState<PersistedState>(() => loadInitialState());

  const [stage, setStage] = useState<AppStage>("splash");
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(initial.hasCompletedSetup);
  const [editingAvatarFromMe, setEditingAvatarFromMe] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<MainTab>("home");
  const [subView, setSubView] = useState<SubView>("none");
  const [notesSection, setNotesSection] = useState<NotesHubSection>("notes");

  const [avatar, setAvatar] = useState<AvatarConfig>(initial.avatar);
  const [room, setRoom] = useState<RoomConfig>(initial.room);
  const [tasks, setTasks] = useState<TaskItem[]>(initial.tasks);
  const [notes, setNotes] = useState<NoteItem[]>(initial.notes);
  const [lists, setLists] = useState<CustomList[]>(initial.lists);
  const [packKits, setPackKits] = useState<PackKit[]>(initial.packKits);
  const [places, setPlaces] = useState<SavedPlace[]>(initial.places);
  const [homeCare, setHomeCare] = useState<HomeCareTask[]>(initial.homeCare);
  const [birthdays, setBirthdays] = useState<BirthdayPerson[]>(initial.birthdays);
  const [gifts, setGifts] = useState<GiftPlan[]>(initial.gifts);
  const [things, setThings] = useState<PersonalThing[]>(initial.things);
  const [memories, setMemories] = useState<MemoryItem[]>(initial.memories);
  const [moods, setMoods] = useState<MoodEntry[]>(initial.moods);
  const [automations, setAutomations] = useState<ButterAutomation[]>(initial.automations);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initial.expenses);
  const [goals, setGoals] = useState<SavingsGoal[]>(initial.goals);
  const [personalGoals, setPersonalGoals] = useState<PersonalGoal[]>(initial.personalGoals);
  const [habits, setHabits] = useState<HabitItem[]>(initial.habits);
  const [settings, setSettings] = useState<AppSettings>(initial.settings);

  const [privacyUnlocked, setPrivacyUnlocked] = useState<boolean>(!initial.settings.appLockEnabled);
  const [pinPromptOpen, setPinPromptOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [askButterOpen, setAskButterOpen] = useState(false);
  const [quickAddMode, setQuickAddMode] = useState<"task" | "reminder" | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const tr = t(settings.language);
  const langMeta = getLanguageMeta(settings.language);

  useEffect(() => {
    try {
      const payload: PersistedState = {
        hasCompletedSetup,
        avatar,
        room,
        tasks,
        notes,
        lists,
        packKits,
        places,
        homeCare,
        birthdays,
        gifts,
        things,
        memories,
        moods,
        automations,
        expenses,
        goals,
        personalGoals,
        habits,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [
    hasCompletedSetup,
    avatar,
    room,
    tasks,
    notes,
    lists,
    packKits,
    places,
    homeCare,
    birthdays,
    gifts,
    things,
    memories,
    moods,
    automations,
    expenses,
    goals,
    personalGoals,
    habits,
    settings,
  ]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dusk") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (settings.reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
    const scaleValue =
      settings.textScale === "xlarge" ? "1.2" : settings.textScale === "large" ? "1.1" : "1";
    root.style.setProperty("--butter-font-scale", scaleValue);
    root.dir = langMeta.dir;
    root.lang = settings.language;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute("content", settings.theme === "dusk" ? "#1D1B1E" : "#FDFBF7");
    }
  }, [settings, langMeta]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const handleSelectLanguage = (nextLang: AppLanguage) => {
    setSettings((prev) => ({ ...prev, language: nextLang }));
    const nextTr = t(nextLang);
    if (stage === "main") {
      showToast(nextTr.languageUpdatedToast);
    }
  };

  const handleSaveAvatar = (nextConfig: AvatarConfig, nextRoom: RoomConfig) => {
    setAvatar(nextConfig);
    setRoom(nextRoom);
    setHasCompletedSetup(true);
    setEditingAvatarFromMe(false);
    setStage("main");
    showToast(tr.toastSavedAvatar);
  };

  const handleSaveParsedButter = (parsed: ParsedButterItem[]) => {
    const newTasks: TaskItem[] = [];
    const newNotes: NoteItem[] = [];
    const shoppingAdditions: string[] = [];
    const newExpenses: ExpenseItem[] = [];

    for (const item of parsed) {
      if (item.destination === "shopping") {
        shoppingAdditions.push(item.title);
      } else if (item.destination === "note") {
        newNotes.push({
          id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: item.title,
          content: item.note || item.timeLabel || tr.askButter,
          kind: "note",
          pastel: categoryToPastel(item.category),
          updatedAt: tr.viewToday,
        });
      } else if (item.destination === "money" && item.amount && item.amount > 0) {
        newExpenses.push({
          id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          amount: item.amount,
          category: item.category === "food" ? "Food" : "Shopping",
          note: item.title,
          dateISO: getTodayISO(),
        });
      } else {
        const matchedPlace = item.locationTrigger
          ? places.find((p) => p.name.toLowerCase().includes(item.locationTrigger!.toLowerCase()))
          : undefined;
        newTasks.push({
          id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: item.title,
          timeLabel: item.timeLabel,
          dateISO: item.bucket === "tomorrow" ? getOffsetISO(1) : getTodayISO(),
          bucket: item.bucket,
          category: item.category,
          pastel: categoryToPastel(item.category),
          completed: false,
          reminder: item.reminder || item.destination === "reminder",
          reminderSchedule: matchedPlace
            ? "location"
            : item.recurrence && (item.recurrence as string) !== "none"
              ? item.recurrence
              : "once",
          locationPlaceId: matchedPlace?.id,
        });
      }
    }

    if (newTasks.length > 0) setTasks((prev) => [...newTasks, ...prev]);
    if (newNotes.length > 0) setNotes((prev) => [...newNotes, ...prev]);
    if (newExpenses.length > 0) setExpenses((prev) => [...newExpenses, ...prev]);
    if (shoppingAdditions.length > 0) {
      setLists((prev) => {
        const target = prev.find((l) => l.icon === "shopping") || prev[0];
        if (!target) {
          return [
            {
              id: `l-${Date.now()}`,
              title: tr.destShopping,
              icon: "shopping",
              pastel: "yellow",
              items: shoppingAdditions.map((text, idx) => ({
                id: `li-${Date.now()}-${idx}`,
                text,
                checked: false,
              })),
            },
          ];
        }
        return prev.map((l) =>
          l.id === target.id
            ? {
                ...l,
                items: [
                  ...l.items,
                  ...shoppingAdditions.map((text, idx) => ({
                    id: `li-${Date.now()}-${idx}`,
                    text,
                    checked: false,
                  })),
                ],
              }
            : l
        );
      });
    }

    showToast(
      fmt(tr.toastSavedItems, {
        count: formatLocaleNumber(parsed.length, settings.language, settings.region),
      })
    );
  };

  const handleExportData = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            app: "BETTER",
            exportedAt: new Date().toISOString(),
            avatar,
            room,
            tasks,
            notes,
            lists,
            packKits,
            places,
            homeCare,
            birthdays,
            gifts,
            things,
            memories,
            moods,
            automations,
            expenses,
            goals,
            personalGoals,
            habits,
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `better-backup-${getTodayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(tr.toastExported);
  };

  const verifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === (settings.appLockPin || "1234")) {
      setPrivacyUnlocked(true);
      setPinPromptOpen(false);
      setPinInput("");
      setPinError(false);
      showToast(tr.toastUnlocked);
    } else {
      setPinError(true);
    }
  };

  if (stage === "splash" || stage === "onboarding") {
    return (
      <SplashAndOnboarding
        stage={stage}
        language={settings.language}
        onSelectLanguage={handleSelectLanguage}
        onFinishSplash={() => setStage(hasCompletedSetup ? "main" : "onboarding")}
        onFinishOnboarding={() => setStage("avatar-setup")}
        reducedMotion={settings.reducedMotion}
      />
    );
  }

  // App Lock Gate
  if (settings.appLockEnabled && !privacyUnlocked && stage === "main") {
    return (
      <div className="min-h-[100dvh] bg-[#FDFBF7] dark:bg-[#1D1B1E] flex items-center justify-center p-6 pt-header-safe pb-sheet-safe">
        <form
          onSubmit={verifyPin}
          className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-7 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EFEAF9] dark:bg-[#3A314E] flex items-center justify-center">
            <Lock className="w-7 h-7 text-[#4C3B6E] dark:text-[#DCD2F2]" />
          </div>
          <h1 className="font-display text-2xl font-bold">{tr.welcomeBackLock}</h1>
          <p className="text-xs text-[#6C665F] dark:text-[#B6AFA6]">
            {tr.enterPinHint}
          </p>
          <input
            type="password"
            maxLength={4}
            autoFocus
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4));
              setPinError(false);
            }}
            placeholder="••••"
            className="w-full min-h-[48px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] text-center font-mono-num text-xl tracking-[0.5em]"
          />
          {pinError && <p className="text-xs text-[#9E475B]">{tr.wrongPin}</p>}
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724] font-semibold"
          >
            {tr.unlock} 🫧
          </button>
          {settings.biometricEnabled && (
            <button
              type="button"
              onClick={() => {
                setPrivacyUnlocked(true);
                showToast(tr.toastUnlocked);
              }}
              className="w-full min-h-[44px] rounded-2xl bg-[#E3F1FA] dark:bg-[#21303B] text-xs font-semibold text-[#1F3A4D] dark:text-[#E3F1FA]"
            >
              {tr.useFaceId}
            </button>
          )}
        </form>
      </div>
    );
  }

  if (stage === "avatar-setup") {
    return (
      <AvatarStudio
        language={settings.language}
        initialConfig={avatar}
        initialRoom={room}
        completedTasksCount={tasks.filter((tItem) => tItem.completed).length}
        onSave={handleSaveAvatar}
        isEditingExisting={editingAvatarFromMe}
        onCancel={() => {
          setEditingAvatarFromMe(false);
          setStage("main");
        }}
        animated={settings.avatarAnimations && !settings.reducedMotion}
      />
    );
  }

  const navigateTab = (tab: MainTab) => {
    setSubView("none");
    setActiveTab(tab);
  };

  const accent = ACCENT_THEMES[settings.accentColor] || ACCENT_THEMES.butter;

  const navItems: { id: MainTab; label: string; Icon: typeof HomeIcon }[] = [
    { id: "home", label: tr.navHome, Icon: HomeIcon },
    { id: "plan", label: tr.navPlan, Icon: PlannerIcon },
    { id: "notes", label: tr.navNotes, Icon: NotesIcon },
    { id: "me", label: tr.navMe, Icon: AvatarNavIcon },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] dark:bg-[#1D1B1E] text-[#2A2724] dark:text-[#F7F4EE] transition-colors flex flex-col">
      {/* Sticky Frosted Top Bar with Notch Safe Area */}
      <header className="sticky top-0 z-30 butter-glass border-b border-[#EFEAE0] dark:border-white/10 pt-header-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          <button
            type="button"
            onClick={() => navigateTab("home")}
            className="min-h-[44px] flex items-center gap-2 whitespace-nowrap shrink-0 rounded-xl"
          >
            <BetterLogoIcon className="w-8 h-8" />
            <span className="font-display text-lg font-bold tracking-tight">BETTER</span>
          </button>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6" aria-label="Primary navigation">
            {navItems.map((item) => {
              const isCurrent = subView === "none" && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === "notes") setNotesSection("notes");
                    navigateTab(item.id);
                  }}
                  style={isCurrent ? { backgroundColor: accent.bg, color: accent.text } : undefined}
                  className={`min-h-[44px] px-3.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    isCurrent
                      ? ""
                      : "text-[#6C665F] dark:text-[#B6AFA6] hover:text-[#2A2724] dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setAskButterOpen(true)}
              className="min-h-[44px] px-3.5 rounded-2xl bg-[#EFEAF9] dark:bg-[#2D273B] border border-[#DACFF0] dark:border-white/10 text-xs sm:text-sm font-semibold text-[#4C3B6E] dark:text-[#DCD2F2] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <MagicWandIcon className="w-4 h-4" />
              <span>{tr.askButter}</span>
            </button>
          </div>
        </div>
      </header>

      <OfflineIndicator language={settings.language} />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-nav-safe">
        {subView === "none" && activeTab === "home" && (
          <div className="mb-5">
            <PWAInstallBanner language={settings.language} />
          </div>
        )}
        {subView === "language" ? (
          <LanguageSelector
            selectedLanguage={settings.language}
            onSelectLanguage={handleSelectLanguage}
            mode="settings"
            onBack={() => setSubView("none")}
          />
        ) : subView === "money" ? (
          <MoneyScreen
            language={settings.language}
            region={settings.region}
            currency={settings.currency}
            expenses={expenses}
            goals={goals}
            onAddExpense={(payload) => {
              setExpenses((prev) => [{ id: `e-${Date.now()}`, ...payload }, ...prev]);
              showToast(tr.toastSpending);
            }}
            onDeleteExpense={(id) => setExpenses((prev) => prev.filter((e) => e.id !== id))}
            onAddGoal={(title, targetAmount) => {
              setGoals((prev) => [
                ...prev,
                { id: `g-${Date.now()}`, title, targetAmount, savedAmount: 0, pastel: "lavender" },
              ]);
              showToast(tr.toastGoal);
            }}
            onContributeGoal={(goalId, amount) =>
              setGoals((prev) =>
                prev.map((g) =>
                  g.id === goalId
                    ? { ...g, savedAmount: Math.min(g.targetAmount, g.savedAmount + amount) }
                    : g
                )
              )
            }
            onChangeCurrency={(c) => setSettings((p) => ({ ...p, currency: c }))}
            onBack={() => setSubView("none")}
          />
        ) : subView === "pack" ? (
          <PackAndGoView
            language={settings.language}
            region={settings.region}
            kits={packKits}
            onToggleItem={(kitId, itemId) =>
              setPackKits((prev) =>
                prev.map((k) =>
                  k.id === kitId
                    ? {
                        ...k,
                        items: k.items.map((it) =>
                          it.id === itemId ? { ...it, checked: !it.checked } : it
                        ),
                      }
                    : k
                )
              )
            }
            onAddItem={(kitId, text) =>
              setPackKits((prev) =>
                prev.map((k) =>
                  k.id === kitId
                    ? { ...k, items: [...k.items, { id: `pki-${Date.now()}`, text, checked: false }] }
                    : k
                )
              )
            }
            onResetKit={(kitId) =>
              setPackKits((prev) =>
                prev.map((k) =>
                  k.id === kitId
                    ? { ...k, items: k.items.map((it) => ({ ...it, checked: false })) }
                    : k
                )
              )
            }
            onCreateKit={(title, items) => {
              setPackKits((prev) => [
                ...prev,
                {
                  id: `pk-${Date.now()}`,
                  title,
                  emoji: "🎒",
                  pastel: "lavender",
                  items: items.map((text, idx) => ({
                    id: `pki-${Date.now()}-${idx}`,
                    text,
                    checked: false,
                  })),
                },
              ]);
              showToast(tr.toastPackCreated);
            }}
            onDeleteKit={(kitId) => setPackKits((prev) => prev.filter((k) => k.id !== kitId))}
            onBack={() => setSubView("none")}
          />
        ) : subView === "places" ? (
          <PlacesView
            language={settings.language}
            places={places}
            onAddPlace={(place) => {
              setPlaces((prev) => [...prev, { id: `p-${Date.now()}`, ...place }]);
              showToast(tr.toastPlaceSaved);
            }}
            onUpdatePlace={(id, patch) =>
              setPlaces((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
            }
            onDeletePlace={(id) => setPlaces((prev) => prev.filter((p) => p.id !== id))}
            onBack={() => setSubView("none")}
          />
        ) : subView === "homecare" ? (
          <HomeCareView
            language={settings.language}
            items={homeCare}
            onToggle={(id) =>
              setHomeCare((prev) =>
                prev.map((i) => (i.id === id ? { ...i, doneThisCycle: !i.doneThisCycle } : i))
              )
            }
            onAdd={(title, kind, schedule) => {
              setHomeCare((prev) => [
                ...prev,
                {
                  id: `hc-${Date.now()}`,
                  title,
                  kind,
                  schedule,
                  doneThisCycle: false,
                  pastel: kind === "laundry" ? "sky" : "sage",
                },
              ]);
              showToast(tr.toastRoutineAdded);
            }}
            onDelete={(id) => setHomeCare((prev) => prev.filter((i) => i.id !== id))}
            onBack={() => setSubView("none")}
          />
        ) : subView === "birthdays" || subView === "gifts" ? (
          <BirthdaysAndGiftsView
            language={settings.language}
            region={settings.region}
            tab={subView}
            onChangeTab={(tb) => setSubView(tb)}
            currency={settings.currency}
            birthdays={birthdays}
            gifts={gifts}
            onAddBirthday={(b) => {
              setBirthdays((prev) => [...prev, { id: `b-${Date.now()}`, ...b }]);
              showToast(tr.toastBirthdaySaved);
            }}
            onDeleteBirthday={(id) => setBirthdays((prev) => prev.filter((b) => b.id !== id))}
            onAddGift={(g) => {
              setGifts((prev) => [...prev, { id: `gf-${Date.now()}`, ...g }]);
              showToast(tr.toastGiftSaved);
            }}
            onCycleGiftStatus={(id) => {
              const order: GiftPlan["status"][] = ["Idea", "Shopping", "Wrapped", "Given"];
              setGifts((prev) =>
                prev.map((g) =>
                  g.id === id
                    ? { ...g, status: order[(order.indexOf(g.status) + 1) % order.length] }
                    : g
                )
              );
            }}
            onDeleteGift={(id) => setGifts((prev) => prev.filter((g) => g.id !== id))}
            onBack={() => setSubView("none")}
          />
        ) : subView === "automations" ? (
          <AutomationsView
            language={settings.language}
            automations={automations}
            onToggle={(id) =>
              setAutomations((prev) =>
                prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
              )
            }
            onAdd={(whenLabel, doLabel, triggerType) => {
              setAutomations((prev) => [
                ...prev,
                {
                  id: `au-${Date.now()}`,
                  whenLabel,
                  doLabel,
                  triggerType,
                  enabled: true,
                  pastel: "yellow",
                },
              ]);
              showToast(tr.toastAutoCreated);
            }}
            onDelete={(id) => setAutomations((prev) => prev.filter((a) => a.id !== id))}
            onBack={() => setSubView("none")}
          />
        ) : activeTab === "home" ? (
          <HomeScreen
            avatar={avatar}
            room={room}
            tasks={tasks}
            birthdays={birthdays}
            moods={moods}
            settings={settings}
            onToggleTask={(id) =>
              setTasks((prev) =>
                prev.map((tItem) => (tItem.id === id ? { ...tItem, completed: !tItem.completed } : tItem))
              )
            }
            onQuickAdd={(mode) => setQuickAddMode(mode)}
            onOpenShopping={() => {
              setSubView("none");
              setNotesSection("lists");
              setActiveTab("notes");
            }}
            onOpenSubView={(view) => setSubView(view)}
            onOpenAskButter={() => setAskButterOpen(true)}
            onGoToPlan={() => navigateTab("plan")}
            onCustomizeAvatar={() => {
              setEditingAvatarFromMe(true);
              setStage("avatar-setup");
            }}
            onLogMood={(mood, note) => {
              const today = getTodayISO();
              setMoods((prev) => [
                ...prev.filter((m) => m.dateISO !== today),
                { id: `md-${Date.now()}`, mood, note, dateISO: today },
              ]);
              showToast(tr.toastMood);
            }}
            onUpdateSettings={(patch) => setSettings((prev) => ({ ...prev, ...patch }))}
          />
        ) : activeTab === "plan" ? (
          <PlanScreen
            language={settings.language}
            region={settings.region}
            tasks={tasks}
            places={places}
            birthdays={birthdays}
            onToggleTask={(id) =>
              setTasks((prev) =>
                prev.map((tItem) => (tItem.id === id ? { ...tItem, completed: !tItem.completed } : tItem))
              )
            }
            onAddTask={(payload) => {
              setTasks((prev) => [{ id: `t-${Date.now()}`, completed: false, ...payload }, ...prev]);
              showToast(tr.toastPlanAdded);
            }}
            onUpdateTask={(id, patch) =>
              setTasks((prev) => prev.map((tItem) => (tItem.id === id ? { ...tItem, ...patch } : tItem)))
            }
            onDeleteTask={(id) => setTasks((prev) => prev.filter((tItem) => tItem.id !== id))}
            onOpenAskButter={() => setAskButterOpen(true)}
            onOpenSubView={(view) => setSubView(view)}
          />
        ) : activeTab === "notes" ? (
          <NotesAndListsScreen
            language={settings.language}
            region={settings.region}
            section={notesSection}
            onChangeSection={setNotesSection}
            notes={notes}
            lists={lists}
            memories={memories}
            things={things}
            privacyUnlocked={privacyUnlocked}
            onUnlockPrivacy={() => setPinPromptOpen(true)}
            onAddNote={(note) => {
              setNotes((prev) => [
                { id: `n-${Date.now()}`, updatedAt: tr.viewToday, ...note },
                ...prev,
              ]);
              showToast(tr.toastNoteSaved);
            }}
            onUpdateNote={(id, patch) =>
              setNotes((prev) =>
                prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: tr.viewToday } : n))
              )
            }
            onDeleteNote={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
            onConvertNoteToShoppingList={(note) => {
              const rawItems = note.content
                .replace(/^buy\s+/i, "")
                .split(/,|and|\n/i)
                .map((s) => s.replace(/[.]/g, "").trim())
                .filter(Boolean);
              const itemsToAdd = rawItems.length > 0 ? rawItems : [note.title];
              setLists((prev) => [
                {
                  id: `l-${Date.now()}`,
                  title: note.title || tr.destShopping,
                  icon: "shopping",
                  pastel: "yellow",
                  items: itemsToAdd.map((text, idx) => ({
                    id: `li-${Date.now()}-${idx}`,
                    text,
                    checked: false,
                  })),
                },
                ...prev,
              ]);
              setNotesSection("lists");
              showToast(tr.toastTurnedList);
            }}
            onConvertNoteToTask={(note) => {
              setTasks((prev) => [
                {
                  id: `t-${Date.now()}`,
                  title: note.title,
                  timeLabel: tr.viewToday,
                  dateISO: getTodayISO(),
                  bucket: "today",
                  category: "general",
                  pastel: note.pastel,
                  completed: false,
                  reminder: false,
                },
                ...prev,
              ]);
              showToast(tr.toastTurnedTask);
            }}
            onAddList={(title, pastel, icon) => {
              setLists((prev) => [
                ...prev,
                { id: `l-${Date.now()}`, title, pastel, icon, items: [] },
              ]);
              showToast(tr.toastListCreated);
            }}
            onDeleteList={(listId) => setLists((prev) => prev.filter((l) => l.id !== listId))}
            onAddListItem={(listId, text) =>
              setLists((prev) =>
                prev.map((l) =>
                  l.id === listId
                    ? { ...l, items: [...l.items, { id: `li-${Date.now()}`, text, checked: false }] }
                    : l
                )
              )
            }
            onToggleListItem={(listId, itemId) =>
              setLists((prev) =>
                prev.map((l) =>
                  l.id === listId
                    ? {
                        ...l,
                        items: l.items.map((it) =>
                          it.id === itemId ? { ...it, checked: !it.checked } : it
                        ),
                      }
                    : l
                )
              )
            }
            onDeleteListItem={(listId, itemId) =>
              setLists((prev) =>
                prev.map((l) =>
                  l.id === listId
                    ? { ...l, items: l.items.filter((it) => it.id !== itemId) }
                    : l
                )
              )
            }
            onAddMemory={(m) => {
              setMemories((prev) => [{ id: `m-${Date.now()}`, ...m }, ...prev]);
              showToast(tr.toastMemorySaved);
            }}
            onDeleteMemory={(id) => setMemories((prev) => prev.filter((m) => m.id !== id))}
            onAddThing={(thingItem) => {
              setThings((prev) => [{ id: `th-${Date.now()}`, ...thingItem }, ...prev]);
              showToast(tr.toastThingSaved);
            }}
            onDeleteThing={(id) => setThings((prev) => prev.filter((thingItem) => thingItem.id !== id))}
          />
        ) : (
          <MeScreen
            avatar={avatar}
            room={room}
            habits={habits}
            personalGoals={personalGoals}
            memoriesCount={memories.length}
            completedTasksCount={tasks.filter((tItem) => tItem.completed).length}
            settings={settings}
            onCustomizeAvatar={() => {
              setEditingAvatarFromMe(true);
              setStage("avatar-setup");
            }}
            onToggleHabit={(id) =>
              setHabits((prev) =>
                prev.map((h) => {
                  if (h.id !== id) return h;
                  const nextDone = !h.completedToday;
                  return {
                    ...h,
                    completedToday: nextDone,
                    completedCountThisWeek: nextDone
                      ? Math.min(h.targetPerWeek, h.completedCountThisWeek + 1)
                      : Math.max(0, h.completedCountThisWeek - 1),
                  };
                })
              )
            }
            onAddHabit={(title, frequency) =>
              setHabits((prev) => [
                ...prev,
                {
                  id: `h-${Date.now()}`,
                  title,
                  frequency,
                  completedCountThisWeek: 0,
                  targetPerWeek:
                    frequency === "Daily" ? 7 : frequency === "3x / week" ? 3 : frequency === "Weekends" ? 2 : 1,
                  completedToday: false,
                  pastel: "sage",
                },
              ])
            }
            onToggleGoalStep={(goalId, stepId) =>
              setPersonalGoals((prev) =>
                prev.map((g) =>
                  g.id === goalId
                    ? {
                        ...g,
                        steps: g.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)),
                      }
                    : g
                )
              )
            }
            onAddPersonalGoal={(title, description, targetDate, steps) => {
              setPersonalGoals((prev) => [
                ...prev,
                {
                  id: `pg-${Date.now()}`,
                  title,
                  description,
                  targetDate,
                  steps: steps.map((text, idx) => ({
                    id: `ps-${Date.now()}-${idx}`,
                    text,
                    done: false,
                  })),
                  pastel: "yellow",
                },
              ]);
              showToast(tr.toastGoal);
            }}
            onOpenSubView={(view) => setSubView(view)}
            onUpdateSettings={(patch) => setSettings((prev) => ({ ...prev, ...patch }))}
            onExportData={handleExportData}
            onResetApp={() => {
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem("butter_companion_state_v2");
              localStorage.removeItem("butter_companion_state_v1");
              setHasCompletedSetup(false);
              setAvatar(DEFAULT_AVATAR);
              setRoom(DEFAULT_ROOM);
              setTasks(DEFAULT_TASKS);
              setNotes(DEFAULT_NOTES);
              setLists(DEFAULT_LISTS);
              setPackKits(DEFAULT_PACK_KITS);
              setPlaces(DEFAULT_PLACES);
              setHomeCare(DEFAULT_HOMECARE);
              setBirthdays(DEFAULT_BIRTHDAYS);
              setGifts(DEFAULT_GIFTS);
              setThings(DEFAULT_THINGS);
              setMemories(DEFAULT_MEMORIES);
              setMoods(DEFAULT_MOODS);
              setAutomations(DEFAULT_AUTOMATIONS);
              setExpenses(DEFAULT_EXPENSES);
              setGoals(DEFAULT_GOALS);
              setPersonalGoals(DEFAULT_PERSONAL_GOALS);
              setHabits(DEFAULT_HABITS);
              setSettings(DEFAULT_SETTINGS);
              setSubView("none");
              setActiveTab("home");
              setStage("onboarding");
            }}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation (4 main destinations) */}
      <nav
        aria-label="Bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 butter-glass border-t border-[#EAE4D8] dark:border-white/10 pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
          {navItems.map(({ id, label, Icon }) => {
            const active = subView === "none" && activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigateTab(id)}
                className="min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-transform active:scale-95"
              >
                <span
                  style={active ? { backgroundColor: accent.bg } : undefined}
                  className={`px-3.5 py-1 rounded-2xl transition-all duration-200 ${
                    active ? "scale-105" : ""
                  }`}
                >
                  <Icon className="w-6 h-6" active={active} />
                </span>
                <span
                  className={`text-[11px] font-semibold tracking-tight ${
                    active
                      ? "text-[#2A2724] dark:text-[#FDF1C7]"
                      : "text-[#6C665F] dark:text-[#B6AFA6]"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Toast Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)] truncate px-4 py-2.5 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold shadow-lg whitespace-nowrap"
        >
          {toast}
        </div>
      )}

      {/* Private Notes/Memories PIN Unlock Modal */}
      {pinPromptOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={verifyPin}
            className="w-full max-w-xs rounded-3xl bg-[#FDFBF7] dark:bg-[#232126] border border-[#EAE4D8] p-6 space-y-4 text-center"
          >
            <h3 className="font-display text-lg font-bold">{tr.unlockPrivateTitle}</h3>
            <input
              type="password"
              maxLength={4}
              autoFocus
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4));
                setPinError(false);
              }}
              placeholder="••••"
              className="w-full min-h-[44px] px-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] text-center font-mono-num text-lg"
            />
            {pinError && <p className="text-xs text-[#9E475B]">{tr.wrongPin}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPinPromptOpen(false)}
                className="flex-1 min-h-[44px] rounded-2xl bg-[#F3EFE7] text-xs font-semibold"
              >
                {tr.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[44px] rounded-2xl bg-[#2A2724] text-white text-xs font-semibold"
              >
                {tr.unlock}
              </button>
            </div>
          </form>
        </div>
      )}

      <AskButterModal
        isOpen={askButterOpen}
        language={settings.language}
        currency={settings.currency}
        scheduleSummary={tasks
          .filter((tItem) => tItem.bucket === "today")
          .map((tItem) => `${tItem.timeLabel || tr.viewToday}: ${tItem.title}`)
          .join("; ")}
        onClose={() => setAskButterOpen(false)}
        onSaveItems={handleSaveParsedButter}
      />

      <QuickAddModal
        isOpen={quickAddMode !== null}
        language={settings.language}
        initialMode={quickAddMode ?? "task"}
        onClose={() => setQuickAddMode(null)}
        onAddTask={(payload) => {
          setTasks((prev) => [
            { id: `t-${Date.now()}`, dateISO: getTodayISO(), completed: false, ...payload },
            ...prev,
          ]);
          showToast(payload.reminder ? tr.toastReminderSet : tr.toastAddedButter);
        }}
      />
    </div>
  );
}
