import type {
  AppSettings,
  AvatarConfig,
  BirthdayPerson,
  ButterAutomation,
  CustomList,
  ExpenseItem,
  GiftPlan,
  HabitItem,
  HomeCareTask,
  MemoryItem,
  MoodEntry,
  NoteItem,
  PackKit,
  PastelTone,
  PersonalGoal,
  PersonalThing,
  RoomConfig,
  SavedPlace,
  SavingsGoal,
  TaskItem,
} from "../types/butter";

export function getTodayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getOffsetISO(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getUpcomingMM_DD(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}-${day}`;
}

export const PASTEL_CARD_CLASSES: Record<PastelTone, string> = {
  sage: "bg-[#E6F1E9] dark:bg-[#24332A] border-[#C9E0D0] dark:border-[#344A3C]",
  sky: "bg-[#E3F1FA] dark:bg-[#21303B] border-[#C5E0F2] dark:border-[#304554]",
  yellow: "bg-[#FDF3CD] dark:bg-[#38321F] border-[#F2E09E] dark:border-[#4F472B]",
  lavender: "bg-[#EFEAF9] dark:bg-[#2D273B] border-[#DACFF0] dark:border-[#413954]",
  pink: "bg-[#FCEAF0] dark:bg-[#39252D] border-[#F2CEDB] dark:border-[#523440]",
  cream: "bg-[#FBF8F1] dark:bg-[#2E2C28] border-[#EAE3D5] dark:border-[#423E38]",
};

export const PASTEL_SWATCHES: { id: PastelTone; label: string; hex: string }[] = [
  { id: "yellow", label: "Sunbeam", hex: "#F9E6A2" },
  { id: "sage", label: "Sage", hex: "#CBE3D2" },
  { id: "sky", label: "Sky", hex: "#CBE5F6" },
  { id: "lavender", label: "Lavender", hex: "#DCD2F2" },
  { id: "pink", label: "Blush", hex: "#F7D3DF" },
  { id: "cream", label: "Oat", hex: "#F1EAE0" },
];

export const ACCENT_THEMES = {
  butter: { label: "Sunbeam", bg: "#FDF1C7", border: "#DFC97B", text: "#2A2724" },
  sage: { label: "Sage", bg: "#DCECE1", border: "#9CC2A8", text: "#1F3627" },
  sky: { label: "Sky", bg: "#DCEEF8", border: "#98C4DF", text: "#1C3546" },
  lavender: { label: "Lavender", bg: "#EAE4F7", border: "#BCAEE0", text: "#32264B" },
  pink: { label: "Blush", bg: "#FCE6EC", border: "#E3B0C0", text: "#4C2230" },
} as const;

export const MANUAL_CITIES: { name: string; lat: number; lon: number }[] = [
  { name: "Erbil", lat: 36.1911, lon: 44.0092 },
  { name: "Baghdad", lat: 33.3152, lon: 44.3661 },
  { name: "London", lat: 51.5072, lon: -0.1276 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
];

export const DEFAULT_AVATAR: AvatarConfig = {
  name: "Mina",
  style: "soft",
  skinTone: "#F2C9AC",
  hairStyle: "bob",
  hairColor: "#4A3429",
  topStyle: "sweater",
  topColor: "#B8D8C2",
  bottomStyle: "jeans",
  bottomColor: "#6B8CA8",
  dressStyle: "none",
  dressColor: "#E8C5D4",
  jacketStyle: "none",
  shoeStyle: "sneakers",
  glasses: "round",
  hat: "none",
  bag: "tote",
  headphones: "none",
  smallAcc: "blush",
};

export const DEFAULT_ROOM: RoomConfig = {
  backdrop: "sky",
  plant: "sprout",
  furniture: "cozy-desk",
  poster: "sun",
  decor: "fairy-lights",
  rugColor: "#FDF1C7",
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "day",
  accentColor: "butter",
  language: "en",
  region: "auto",
  currency: "IQD",
  textScale: "standard",
  reducedMotion: false,
  avatarAnimations: true,
  morningBriefing: true,
  reminderChimes: true,
  locationPermission: "unset",
  manualCity: "Erbil",
  appLockEnabled: false,
  appLockPin: "1234",
  biometricEnabled: false,
  homeCardOrder: ["weather", "avatar", "your-day", "wind-down", "mood"],
  hiddenHomeCards: [],
  daysActive: 7,
};

export const DEFAULT_TASKS: TaskItem[] = [
  {
    id: "t-1",
    title: "School",
    timeLabel: "8:00 AM",
    dateISO: getTodayISO(),
    bucket: "today",
    category: "school",
    pastel: "sky",
    completed: false,
    reminder: true,
    reminderSchedule: "daily",
    isEvent: true,
  },
  {
    id: "t-2",
    title: "Homework",
    timeLabel: "4:00 PM",
    dateISO: getTodayISO(),
    bucket: "today",
    category: "homework",
    pastel: "lavender",
    completed: false,
    reminder: true,
    reminderSchedule: "once",
  },
  {
    id: "t-3",
    title: "Buy shampoo",
    timeLabel: "6:00 PM",
    dateISO: getTodayISO(),
    bucket: "today",
    category: "shopping",
    pastel: "yellow",
    completed: false,
    reminder: true,
    reminderSchedule: "location",
    locationPlaceId: "p-shop",
  },
  {
    id: "t-4",
    title: "Morning matcha & stretch",
    timeLabel: "8:30 AM",
    dateISO: getOffsetISO(1),
    bucket: "tomorrow",
    category: "selfcare",
    pastel: "sage",
    completed: false,
    reminder: true,
    reminderSchedule: "once",
  },
  {
    id: "t-5",
    title: "Pick up birthday gift for Lana",
    timeLabel: "5:00 PM",
    dateISO: getOffsetISO(1),
    bucket: "tomorrow",
    category: "errand",
    pastel: "pink",
    completed: false,
    reminder: false,
  },
  {
    id: "t-6",
    title: "Prepare school bag",
    timeLabel: "Sunday evening",
    dateISO: getOffsetISO(3),
    bucket: "week",
    category: "school",
    pastel: "sky",
    completed: false,
    reminder: true,
    reminderSchedule: "sunday",
  },
];

export const DEFAULT_NOTES: NoteItem[] = [
  {
    id: "n-1",
    title: "Shopping run",
    content: "Buy shampoo, notebook and snacks.",
    kind: "shopping",
    pastel: "yellow",
    pinned: true,
    updatedAt: "Today",
  },
  {
    id: "n-2",
    title: "Cozy weekend ideas",
    content: "Bake cinnamon toast, organize bookshelf by color, and take a slow afternoon walk.",
    kind: "idea",
    pastel: "sage",
    pinned: true,
    updatedAt: "Today",
  },
  {
    id: "n-3",
    title: "Locker & library note",
    content: "Locker #14B · Return art history book before Thursday afternoon.",
    kind: "note",
    pastel: "pink",
    isPrivate: false,
    updatedAt: "Yesterday",
  },
  {
    id: "n-4",
    title: "Quiet tea moment",
    content: "Warm chamomile tea while rain tapped the window.",
    kind: "memory",
    pastel: "lavender",
    updatedAt: "2 days ago",
  },
];

export const DEFAULT_LISTS: CustomList[] = [
  {
    id: "l-shopping",
    title: "Shopping",
    icon: "shopping",
    pastel: "yellow",
    items: [
      { id: "li-1", text: "Shampoo", checked: false },
      { id: "li-2", text: "Notebook", checked: false },
      { id: "li-3", text: "Snacks", checked: true },
    ],
  },
  {
    id: "l-remember",
    title: "Things to Remember",
    icon: "remember",
    pastel: "lavender",
    items: [
      { id: "li-4", text: "Bring charger", checked: false },
      { id: "li-5", text: "Take book", checked: false },
      { id: "li-6", text: "Buy a gift", checked: false },
    ],
  },
];

export const DEFAULT_PACK_KITS: PackKit[] = [
  {
    id: "pk-school",
    title: "School",
    emoji: "🎒",
    pastel: "sky",
    items: [
      { id: "pki-1", text: "Notebook", checked: true },
      { id: "pki-2", text: "Pencil case", checked: true },
      { id: "pki-3", text: "Charger", checked: false },
      { id: "pki-4", text: "Water bottle", checked: false },
    ],
  },
  {
    id: "pk-trip",
    title: "Trip",
    emoji: "🧳",
    pastel: "yellow",
    items: [
      { id: "pki-5", text: "Clothes", checked: false },
      { id: "pki-6", text: "Charger", checked: false },
      { id: "pki-7", text: "Toiletries", checked: false },
      { id: "pki-8", text: "Passport", checked: false },
    ],
  },
];

export const DEFAULT_PLACES: SavedPlace[] = [
  {
    id: "p-home",
    name: "Home",
    emoji: "🏠",
    note: "Keys stay on the entry tray.",
    reminderText: "Water desk sprout when back",
    pastel: "sage",
  },
  {
    id: "p-school",
    name: "School",
    emoji: "🏫",
    note: "Room 204 for morning lectures.",
    reminderText: "Bring library card",
    pastel: "sky",
  },
  {
    id: "p-shop",
    name: "Favorite Corner Shop",
    emoji: "🛍️",
    note: "Open until 10 PM · Fresh pastries in morning.",
    reminderText: "Buy shampoo & snacks",
    pastel: "yellow",
  },
  {
    id: "p-friend",
    name: "Lana's House",
    emoji: "💛",
    note: "Tea & study sessions on weekends.",
    reminderText: "Bring birthday gift",
    pastel: "pink",
  },
];

export const DEFAULT_HOMECARE: HomeCareTask[] = [
  {
    id: "hc-1",
    title: "Water plants",
    schedule: "Every 3 days",
    kind: "home",
    doneThisCycle: true,
    pastel: "sage",
  },
  {
    id: "hc-2",
    title: "Organize desk",
    schedule: "Weekly",
    kind: "home",
    doneThisCycle: false,
    pastel: "yellow",
  },
  {
    id: "hc-3",
    title: "Change bedsheets",
    schedule: "Bi-weekly",
    kind: "home",
    doneThisCycle: false,
    pastel: "lavender",
  },
  {
    id: "hc-4",
    title: "Wash clothes",
    schedule: "Weekly",
    kind: "laundry",
    doneThisCycle: true,
    pastel: "sky",
  },
  {
    id: "hc-5",
    title: "Dry & fold clothes",
    schedule: "Weekly",
    kind: "laundry",
    doneThisCycle: false,
    pastel: "pink",
  },
  {
    id: "hc-6",
    title: "Put clothes away",
    schedule: "Weekly",
    kind: "laundry",
    doneThisCycle: false,
    pastel: "cream",
  },
];

export const DEFAULT_BIRTHDAYS: BirthdayPerson[] = [
  {
    id: "b-1",
    name: "Lana",
    dateMM_DD: getUpcomingMM_DD(4),
    giftIdea: "Ceramic matcha mug & pastel sketchbook",
    notes: "Loves sage green and vanilla tea.",
    pastel: "pink",
  },
  {
    id: "b-2",
    name: "Omar",
    dateMM_DD: getUpcomingMM_DD(18),
    giftIdea: "Wireless mini speaker",
    notes: "Celebration dinner on Friday.",
    pastel: "sky",
  },
];

export const DEFAULT_GIFTS: GiftPlan[] = [
  {
    id: "gf-1",
    person: "Lana",
    gift: "Ceramic matcha mug",
    budget: 20000,
    dateLabel: "In 4 days",
    status: "Shopping",
    notes: "Check the corner craft shop.",
    pastel: "pink",
  },
  {
    id: "gf-2",
    person: "Mom",
    gift: "Lavender hand cream set",
    budget: 25000,
    dateLabel: "Next month",
    status: "Idea",
    notes: "Wrap with cream ribbon.",
    pastel: "lavender",
  },
];

export const DEFAULT_THINGS: PersonalThing[] = [
  {
    id: "th-1",
    name: "iPad charger",
    location: "Desk drawer (top right)",
    notes: "White braided USB-C cable.",
    pastel: "sky",
  },
  {
    id: "th-2",
    name: "School certificate",
    location: "Cream folder on shelf",
    notes: "Kept inside clear sleeve.",
    pastel: "yellow",
  },
  {
    id: "th-3",
    name: "Spare house key",
    location: "Ceramic bowl by door",
    notes: "Has tiny star keychain.",
    pastel: "sage",
  },
];

export const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: "m-1",
    title: "Rainy afternoon bakery stop",
    note: "Shared warm cinnamon toast while watching the rain.",
    dateISO: getOffsetISO(-2),
    pastel: "yellow",
  },
  {
    id: "m-2",
    title: "Finished first song on guitar",
    note: "Practiced the chords slowly and finally played it through.",
    dateISO: getOffsetISO(-6),
    pastel: "sage",
  },
];

export const DEFAULT_MOODS: MoodEntry[] = [
  { id: "md-1", mood: "good", note: "Slow calm morning", dateISO: getOffsetISO(-3) },
  { id: "md-2", mood: "great", note: "Had lunch with friends", dateISO: getOffsetISO(-2) },
  { id: "md-3", mood: "tired", note: "Long study evening", dateISO: getOffsetISO(-1) },
];

export const DEFAULT_AUTOMATIONS: ButterAutomation[] = [
  {
    id: "au-1",
    whenLabel: "When it is Sunday",
    doLabel: "Remind me to prepare my school bag",
    triggerType: "day",
    enabled: true,
    pastel: "sky",
  },
  {
    id: "au-2",
    whenLabel: "When I arrive at Favorite Corner Shop",
    doLabel: "Remind me to buy shampoo",
    triggerType: "location",
    enabled: true,
    pastel: "yellow",
  },
  {
    id: "au-3",
    whenLabel: "Every month",
    doLabel: "Remind me to review my spending",
    triggerType: "monthly",
    enabled: true,
    pastel: "sage",
  },
];

export const DEFAULT_EXPENSES: ExpenseItem[] = [
  {
    id: "e-1",
    amount: 3000,
    category: "Food",
    note: "Warm bagel & tea",
    dateISO: getTodayISO(),
  },
  {
    id: "e-2",
    amount: 2000,
    category: "Shopping",
    note: "Grid notebook",
    dateISO: getTodayISO(),
  },
  {
    id: "e-3",
    amount: 4500,
    category: "Transport",
    note: "Ride across town",
    dateISO: getOffsetISO(-2),
  },
  {
    id: "e-4",
    amount: 8000,
    category: "Self-Care",
    note: "Hand cream & lip balm",
    dateISO: getOffsetISO(-4),
  },
];

export const DEFAULT_GOALS: SavingsGoal[] = [
  {
    id: "g-1",
    title: "Save money for something important",
    targetAmount: 100000,
    savedAmount: 42000,
    pastel: "sage",
  },
  {
    id: "g-2",
    title: "Cozy headphones fund",
    targetAmount: 60000,
    savedAmount: 28500,
    pastel: "sky",
  },
];

export const DEFAULT_PERSONAL_GOALS: PersonalGoal[] = [
  {
    id: "pg-1",
    title: "Learn guitar 🎸",
    description: "Play 3 cozy acoustic songs smoothly.",
    targetDate: getOffsetISO(45),
    steps: [
      { id: "ps-1", text: "Learn G, C, D, Em chords", done: true },
      { id: "ps-2", text: "Practice strumming 10 min", done: false },
      { id: "ps-3", text: "Play first song start to finish", done: false },
      { id: "ps-4", text: "Record a short voice memo", done: false },
    ],
    pastel: "yellow",
  },
  {
    id: "pg-2",
    title: "Read 6 books this season",
    description: "Gentle 10 pages before sleep.",
    targetDate: getOffsetISO(60),
    steps: [
      { id: "ps-5", text: "Finish book #1", done: true },
      { id: "ps-6", text: "Finish book #2", done: true },
      { id: "ps-7", text: "Pick book #3 from library", done: false },
    ],
    pastel: "lavender",
  },
];

export const DEFAULT_HABITS: HabitItem[] = [
  {
    id: "h-1",
    title: "Drink water",
    frequency: "Daily",
    completedCountThisWeek: 5,
    targetPerWeek: 7,
    completedToday: true,
    pastel: "sky",
  },
  {
    id: "h-2",
    title: "Read 10 pages",
    frequency: "Daily",
    completedCountThisWeek: 4,
    targetPerWeek: 7,
    completedToday: false,
    pastel: "lavender",
  },
  {
    id: "h-3",
    title: "Practice guitar",
    frequency: "3x / week",
    completedCountThisWeek: 2,
    targetPerWeek: 3,
    completedToday: false,
    pastel: "yellow",
  },
  {
    id: "h-4",
    title: "Take quiet breaks",
    frequency: "Daily",
    completedCountThisWeek: 6,
    targetPerWeek: 7,
    completedToday: true,
    pastel: "sage",
  },
];

export const SKIN_TONES = [
  { label: "Porcelain", value: "#FCE2D2" },
  { label: "Peach", value: "#F2C9AC" },
  { label: "Warm Honey", value: "#DFA67B" },
  { label: "Caramel", value: "#C18257" },
  { label: "Chestnut", value: "#8D5838" },
  { label: "Espresso", value: "#5A3724" },
];

export const HAIR_COLORS = [
  { label: "Espresso", value: "#34241D" },
  { label: "Chestnut", value: "#68422F" },
  { label: "Honey", value: "#D4A359" },
  { label: "Ginger", value: "#B85D3B" },
  { label: "Midnight", value: "#2A344B" },
  { label: "Lilac", value: "#9E89C2" },
  { label: "Sage", value: "#6B9279" },
];

export const TOP_COLORS = [
  { label: "Sage", value: "#B8D8C2" },
  { label: "Sky", value: "#B9DAF0" },
  { label: "Butter", value: "#F7E29D" },
  { label: "Lilac", value: "#D2C4EC" },
  { label: "Blush", value: "#F2C5D3" },
  { label: "Oat", value: "#EAE3D7" },
  { label: "Charcoal", value: "#48454A" },
];

export const BOTTOM_COLORS = [
  { label: "Denim", value: "#6B8CA8" },
  { label: "Oat", value: "#DED5C5" },
  { label: "Sage", value: "#7EA38A" },
  { label: "Charcoal", value: "#403E42" },
  { label: "Plum", value: "#78668D" },
];
