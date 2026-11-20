import React, { useState } from "react";
import { Check, Lock, Pin, Plus, Trash2, Upload, X } from "lucide-react";
import { getTodayISO, PASTEL_CARD_CLASSES, PASTEL_SWATCHES } from "../data/defaults";
import { fmt, formatLocaleDate, formatLocaleNumber, t } from "../i18n/translations";
import type {
  AppLanguage,
  AppRegion,
  CustomList,
  MemoryItem,
  NoteItem,
  NoteKind,
  PastelTone,
  PersonalThing,
} from "../types/butter";
import { GiftIcon, MemoryIcon, NotesIcon, SelfCareIcon, ShoppingIcon } from "./CuteIcons";

export type NotesHubSection = "notes" | "lists" | "memories" | "things";

interface NotesAndListsScreenProps {
  language: AppLanguage;
  region: AppRegion;
  section: NotesHubSection;
  onChangeSection: (s: NotesHubSection) => void;
  notes: NoteItem[];
  lists: CustomList[];
  memories: MemoryItem[];
  things: PersonalThing[];
  privacyUnlocked: boolean;
  onUnlockPrivacy: () => void;
  onAddNote: (note: Omit<NoteItem, "id" | "updatedAt">) => void;
  onUpdateNote: (id: string, patch: Partial<NoteItem>) => void;
  onDeleteNote: (id: string) => void;
  onConvertNoteToShoppingList: (note: NoteItem) => void;
  onConvertNoteToTask: (note: NoteItem) => void;
  onAddList: (title: string, pastel: PastelTone, icon: CustomList["icon"]) => void;
  onDeleteList: (listId: string) => void;
  onAddListItem: (listId: string, text: string) => void;
  onToggleListItem: (listId: string, itemId: string) => void;
  onDeleteListItem: (listId: string, itemId: string) => void;
  onAddMemory: (m: Omit<MemoryItem, "id">) => void;
  onDeleteMemory: (id: string) => void;
  onAddThing: (tItem: Omit<PersonalThing, "id">) => void;
  onDeleteThing: (id: string) => void;
}

const NOTE_KIND_KEYS: (NoteKind | "all")[] = [
  "all",
  "note",
  "checklist",
  "idea",
  "shopping",
  "reminder",
  "memory",
];

export const NotesAndListsScreen: React.FC<NotesAndListsScreenProps> = ({
  language,
  region,
  section,
  onChangeSection,
  notes,
  lists,
  memories,
  things,
  privacyUnlocked,
  onUnlockPrivacy,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onConvertNoteToShoppingList,
  onConvertNoteToTask,
  onAddList,
  onDeleteList,
  onAddListItem,
  onToggleListItem,
  onDeleteListItem,
  onAddMemory,
  onDeleteMemory,
  onAddThing,
  onDeleteThing,
}) => {
  const tr = t(language);
  const [kindFilter, setKindFilter] = useState<NoteKind | "all">("all");
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteKind, setNoteKind] = useState<NoteKind>("note");
  const [notePastel, setNotePastel] = useState<PastelTone>("yellow");
  const [notePrivate, setNotePrivate] = useState(false);

  const [newListOpen, setNewListOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListPastel, setNewListPastel] = useState<PastelTone>("sage");
  const [newListIcon, setNewListIcon] = useState<CustomList["icon"]>("shopping");
  const [listItemDrafts, setListItemDrafts] = useState<Record<string, string>>({});

  const [memTitle, setMemTitle] = useState("");
  const [memNote, setMemNote] = useState("");
  const [memDate, setMemDate] = useState(getTodayISO());
  const [memPhoto, setMemPhoto] = useState<string | undefined>(undefined);
  const [memPrivate, setMemPrivate] = useState(false);

  const [thingName, setThingName] = useState("");
  const [thingLoc, setThingLoc] = useState("");
  const [thingNotes, setThingNotes] = useState("");
  const [thingPhoto, setThingPhoto] = useState<string | undefined>(undefined);

  const readImageFile = (file: File | undefined, cb: (url: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") cb(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openNewNote = () => {
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setNoteKind("note");
    setNotePastel("yellow");
    setNotePrivate(false);
    setNoteModalOpen(true);
  };

  const openEditNote = (note: NoteItem) => {
    if (note.isPrivate && !privacyUnlocked) {
      onUnlockPrivacy();
      return;
    }
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteKind(note.kind);
    setNotePastel(note.pastel);
    setNotePrivate(Boolean(note.isPrivate));
    setNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() && !noteContent.trim()) return;
    if (editingNote) {
      onUpdateNote(editingNote.id, {
        title: noteTitle.trim() || tr.newNote,
        content: noteContent.trim(),
        kind: noteKind,
        pastel: notePastel,
        isPrivate: notePrivate,
      });
    } else {
      onAddNote({
        title: noteTitle.trim() || tr.newNote,
        content: noteContent.trim(),
        kind: noteKind,
        pastel: notePastel,
        isPrivate: notePrivate,
      });
    }
    setNoteModalOpen(false);
  };

  const filteredNotes = [...notes]
    .filter((n) => kindFilter === "all" || n.kind === kindFilter)
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EFEAF9] dark:bg-[#2D273B] border border-[#DACFF0] dark:border-white/10 flex items-center justify-center">
            {section === "lists" ? (
              <ShoppingIcon className="w-8 h-8" />
            ) : section === "memories" ? (
              <MemoryIcon className="w-8 h-8" />
            ) : (
              <NotesIcon className="w-8 h-8" active />
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2A2724] dark:text-[#F7F4EE]">
              {section === "notes"
                ? tr.smartNotesTitle
                : section === "lists"
                  ? tr.listsTab
                  : section === "memories"
                    ? tr.memoriesTab
                    : tr.thingsTab}
            </h1>
            <p className="text-sm text-[#6C665F] dark:text-[#B6AFA6]">
              {section === "notes"
                ? tr.smartNotesSub
                : section === "lists"
                  ? tr.listsSub
                  : section === "memories"
                    ? tr.memoriesSub
                    : tr.thingsSub}
            </p>
          </div>
        </div>

        {(section === "notes" || section === "lists") && (
          <button
            type="button"
            onClick={() => (section === "notes" ? openNewNote() : setNewListOpen(true))}
            className="min-h-[44px] px-4 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold text-sm inline-flex items-center gap-1.5"
          >
            <Plus className="w-5 h-5" />
            <span>{section === "notes" ? tr.newNote : tr.newList}</span>
          </button>
        )}
      </div>

      {/* Section Switcher */}
      <div
        className="w-full sm:w-auto flex overflow-x-auto no-scrollbar p-1 rounded-2xl bg-[#F3EFE7] dark:bg-[#27252A] gap-1"
        role="tablist"
      >
        {(
          [
            { id: "notes", label: tr.notesTab },
            { id: "lists", label: tr.listsTab },
            { id: "memories", label: tr.memoriesTab },
            { id: "things", label: tr.thingsTab },
          ] as { id: NotesHubSection; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={section === tab.id}
            onClick={() => onChangeSection(tab.id)}
            className={`min-h-[44px] px-4 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
              section === tab.id
                ? "bg-white dark:bg-[#36333A] text-[#2A2724] dark:text-[#F7F4EE] shadow-sm"
                : "text-[#6C665F] dark:text-[#B6AFA6]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. NOTES */}
      {section === "notes" && (
        <>
          <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap gap-2 pb-1 sm:pb-0">
            {NOTE_KIND_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKindFilter(k)}
                className={`min-h-[40px] px-3.5 rounded-xl text-xs font-semibold border whitespace-nowrap shrink-0 ${
                  kindFilter === k
                    ? "bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724] border-transparent"
                    : "bg-white dark:bg-[#27252A] border-[#E6E0D4] dark:border-white/10 text-[#5C564F] dark:text-[#C8C2B8]"
                }`}
              >
                {tr.noteKinds[k]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
              const locked = Boolean(note.isPrivate && !privacyUnlocked);
              return (
                <article
                  key={note.id}
                  className={`rounded-3xl border p-5 flex flex-col justify-between gap-4 ${
                    PASTEL_CARD_CLASSES[note.pastel]
                  }`}
                >
                  <div
                    onClick={() => openEditNote(note)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") openEditNote(note);
                    }}
                    className="cursor-pointer space-y-2 text-start"
                  >
                    <div className="flex items-center justify-between text-xs text-[#6C665F] dark:text-[#C8C2B8]">
                      <span className="font-medium">
                        {tr.noteKinds[note.kind]} · {note.updatedAt}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {note.isPrivate && <Lock className="w-3.5 h-3.5 text-[#6E569E]" />}
                        {note.pinned && <Pin className="w-3.5 h-3.5 text-[#8A6212]" />}
                      </div>
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#2A2724] dark:text-[#F7F4EE]">
                      {note.title}
                    </h2>
                    {locked ? (
                      <p className="text-xs font-semibold text-[#6E569E] dark:text-[#DCD2F2] py-2">
                        {tr.privateNoteLocked}
                      </p>
                    ) : (
                      <p className="text-sm text-[#4A453E] dark:text-[#DCD6CC] leading-relaxed whitespace-pre-line">
                        {note.content}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/10">
                    {!locked && (
                      <div className="flex flex-wrap gap-1.5">
                        {note.kind === "shopping" || note.content.toLowerCase().includes("buy") ? (
                          <button
                            type="button"
                            onClick={() => onConvertNoteToShoppingList(note)}
                            className="min-h-[40px] px-3 rounded-xl bg-white/85 dark:bg-black/25 text-xs font-semibold"
                          >
                            {tr.turnIntoShopping}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onConvertNoteToTask(note)}
                            className="min-h-[40px] px-3 rounded-xl bg-white/85 dark:bg-black/25 text-xs font-semibold"
                          >
                            {tr.turnIntoTask}
                          </button>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdateNote(note.id, { pinned: !note.pinned })}
                        aria-label="Pin"
                        className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#6C665F]"
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        aria-label={tr.deleteLabel}
                        className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#9E475B]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* 2. LISTS */}
      {section === "lists" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {lists.map((list) => {
            const doneCount = list.items.filter((i) => i.checked).length;
            const draftVal = listItemDrafts[list.id] || "";
            return (
              <section
                key={list.id}
                className={`rounded-3xl border p-5 space-y-4 ${PASTEL_CARD_CLASSES[list.pastel]}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/85 dark:bg-black/20 flex items-center justify-center">
                      {list.icon === "shopping" && <ShoppingIcon className="w-6 h-6" />}
                      {list.icon === "remember" && <NotesIcon className="w-6 h-6" active />}
                      {list.icon === "selfcare" && <SelfCareIcon className="w-6 h-6" />}
                      {list.icon === "gift" && <GiftIcon className="w-6 h-6" />}
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold">{list.title}</h2>
                      <p className="text-xs text-[#6C665F] dark:text-[#C8C2B8] font-mono-num">
                        {fmt(tr.checkedCount, {
                          done: formatLocaleNumber(doneCount, language, region),
                          total: formatLocaleNumber(list.items.length, language, region),
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteList(list.id)}
                    aria-label={tr.deleteLabel}
                    className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-[#9E475B]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-white/80 dark:bg-[#1E1C21]/75 px-3 py-2 flex items-center gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => onToggleListItem(list.id, item.id)}
                        className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center shrink-0 ${
                          item.checked
                            ? "bg-[#4A7C59] border-[#4A7C59] text-white"
                            : "bg-white dark:bg-[#27252A] border-[#CFC8BC] text-transparent"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <span className={`flex-1 text-sm font-medium ${item.checked ? "line-through opacity-55" : ""}`}>
                        {item.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteListItem(list.id, item.id)}
                        aria-label={tr.deleteLabel}
                        className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#8C847B]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!draftVal.trim()) return;
                    onAddListItem(list.id, draftVal.trim());
                    setListItemDrafts((prev) => ({ ...prev, [list.id]: "" }));
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={draftVal}
                    onChange={(e) =>
                      setListItemDrafts((prev) => ({ ...prev, [list.id]: e.target.value }))
                    }
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
      )}

      {/* 3. MEMORIES 🫧 */}
      {section === "memories" && (
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!memTitle.trim()) return;
              onAddMemory({
                title: memTitle.trim(),
                note: memNote.trim(),
                dateISO: memDate,
                photoDataUrl: memPhoto,
                isPrivate: memPrivate,
                pastel: "lavender",
              });
              setMemTitle("");
              setMemNote("");
              setMemPhoto(undefined);
              setMemPrivate(false);
            }}
            className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-3"
          >
            <h2 className="font-display text-base font-bold">{tr.saveMemoryTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={memTitle}
                onChange={(e) => setMemTitle(e.target.value)}
                placeholder={tr.memoryTitlePlaceholder}
                className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
              />
              <input
                type="date"
                value={memDate}
                onChange={(e) => setMemDate(e.target.value)}
                className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 font-mono-num text-sm"
              />
              <label className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-xs font-semibold flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>{memPhoto ? tr.photoAttached : tr.addPhotoOptional}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => readImageFile(e.target.files?.[0], setMemPhoto)}
                />
              </label>
            </div>
            <textarea
              rows={2}
              value={memNote}
              onChange={(e) => setMemNote(e.target.value)}
              placeholder={tr.memoryNotePlaceholder}
              className="w-full p-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm resize-none"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMemPrivate((v) => !v)}
                className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold border inline-flex items-center gap-1.5 ${
                  memPrivate
                    ? "bg-[#EFEAF9] border-[#C8BBE6] text-[#4C3B6E]"
                    : "bg-[#FAF8F4] dark:bg-[#1B191E] border-[#E5DFD3] dark:border-white/10 text-[#6C665F]"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{memPrivate ? tr.privateMemoryBtn : tr.visibleMemoryBtn}</span>
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold"
              >
                {tr.saveMemoryBtn}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {memories.map((m) => {
              const locked = Boolean(m.isPrivate && !privacyUnlocked);
              return (
                <article
                  key={m.id}
                  className={`rounded-3xl border p-5 space-y-3 ${PASTEL_CARD_CLASSES[m.pastel]}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6C665F] dark:text-[#C8C2B8]">
                      🫧 {formatLocaleDate(m.dateISO, language, region, "short")}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteMemory(m.id)}
                      aria-label={tr.deleteLabel}
                      className="min-w-[36px] min-h-[36px] rounded-xl flex items-center justify-center text-[#9E475B]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-display text-lg font-bold">{m.title}</h3>
                  {locked ? (
                    <button
                      type="button"
                      onClick={onUnlockPrivacy}
                      className="min-h-[40px] px-3.5 rounded-xl bg-white/80 text-xs font-semibold text-[#4C3B6E]"
                    >
                      {tr.privateMemoryLocked}
                    </button>
                  ) : (
                    <>
                      {m.note && <p className="text-sm text-[#4A453E] dark:text-[#DCD6CC]">{m.note}</p>}
                      {m.photoDataUrl && (
                        <img
                          src={m.photoDataUrl}
                          alt={m.title}
                          className="w-full max-h-64 object-cover rounded-2xl border border-white/60"
                        />
                      )}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MY THINGS 📦 */}
      {section === "things" && (
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!thingName.trim() || !thingLoc.trim()) return;
              onAddThing({
                name: thingName.trim(),
                location: thingLoc.trim(),
                notes: thingNotes.trim(),
                photoDataUrl: thingPhoto,
                pastel: "sky",
              });
              setThingName("");
              setThingLoc("");
              setThingNotes("");
              setThingPhoto(undefined);
            }}
            className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-3"
          >
            <h2 className="font-display text-base font-bold">{tr.recordThingTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={thingName}
                onChange={(e) => setThingName(e.target.value)}
                placeholder={tr.thingNamePlaceholder}
                className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
              />
              <input
                type="text"
                required
                value={thingLoc}
                onChange={(e) => setThingLoc(e.target.value)}
                placeholder={tr.thingLocPlaceholder}
                className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
              />
              <label className="min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-xs font-semibold flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>{thingPhoto ? tr.photoAttached : tr.addPhotoOptional}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => readImageFile(e.target.files?.[0], setThingPhoto)}
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={thingNotes}
                onChange={(e) => setThingNotes(e.target.value)}
                placeholder={tr.thingNotePlaceholder}
                className="flex-1 min-w-[200px] min-h-[44px] px-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
              />
              <button
                type="submit"
                className="min-h-[44px] px-5 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold"
              >
                {tr.saveItemBtn}
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {things.map((item) => (
              <div key={item.id} className={`rounded-3xl border p-5 space-y-2.5 ${PASTEL_CARD_CLASSES[item.pastel]}`}>
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-lg font-bold">📦 {item.name}</h3>
                  <button
                    type="button"
                    onClick={() => onDeleteThing(item.id)}
                    aria-label={tr.deleteLabel}
                    className="min-w-[36px] min-h-[36px] rounded-xl flex items-center justify-center text-[#9E475B]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-[#2A2724] dark:text-[#F7F4EE]">
                  {tr.locationPrefix} {item.location}
                </p>
                {item.notes && <p className="text-xs text-[#6C665F] dark:text-[#C8C2B8]">{item.notes}</p>}
                {item.photoDataUrl && (
                  <img
                    src={item.photoDataUrl}
                    alt={item.name}
                    className="w-full h-36 object-cover rounded-2xl border border-white/60"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note Create / Edit Modal */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSaveNote}
            className="w-full sm:max-w-md bg-[#FDFBF7] dark:bg-[#232126] rounded-t-3xl sm:rounded-3xl border border-[#EAE4D8] dark:border-white/10 shadow-xl p-5 pb-sheet-safe sm:pb-5 max-h-[92dvh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">
                {editingNote ? tr.editNote : tr.newNote}
              </h3>
              <button
                type="button"
                onClick={() => setNoteModalOpen(false)}
                aria-label={tr.closeLabel}
                className="min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center text-[#6C665F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder={tr.noteTitlePlaceholder}
              className="w-full min-h-[44px] px-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm font-semibold"
            />

            <textarea
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder={tr.noteContentPlaceholder}
              className="w-full p-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm resize-none"
            />

            <div className="grid grid-cols-3 gap-2">
              {(["note", "checklist", "idea", "shopping", "reminder", "memory"] as NoteKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setNoteKind(k)}
                  className={`min-h-[38px] rounded-xl text-xs font-semibold border ${
                    noteKind === k
                      ? "bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724] border-transparent"
                      : "bg-white dark:bg-[#1B191E] border-[#E5DFD3] dark:border-white/10 text-[#6C665F]"
                  }`}
                >
                  {tr.noteKinds[k]}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {PASTEL_SWATCHES.map((sw) => (
                  <button
                    key={sw.id}
                    type="button"
                    aria-label={sw.label}
                    onClick={() => setNotePastel(sw.id)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      notePastel === sw.id ? "border-[#2A2724] dark:border-white scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: sw.hex }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setNotePrivate((v) => !v)}
                className={`min-h-[38px] px-3 rounded-xl text-xs font-semibold border inline-flex items-center gap-1 ${
                  notePrivate
                    ? "bg-[#EFEAF9] border-[#C8BBE6] text-[#4C3B6E]"
                    : "bg-white dark:bg-[#1B191E] border-[#E5DFD3] text-[#6C665F]"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{notePrivate ? tr.privateLabel : tr.openLabel}</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold"
            >
              {tr.saveNote}
            </button>
          </form>
        </div>
      )}

      {/* New List Modal */}
      {newListOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newListTitle.trim()) return;
              onAddList(newListTitle.trim(), newListPastel, newListIcon);
              setNewListTitle("");
              setNewListOpen(false);
            }}
            className="w-full sm:max-w-md bg-[#FDFBF7] dark:bg-[#232126] rounded-t-3xl sm:rounded-3xl border border-[#EAE4D8] dark:border-white/10 shadow-xl p-5 pb-sheet-safe sm:pb-5 max-h-[92dvh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{tr.createCustomList}</h3>
              <button
                type="button"
                onClick={() => setNewListOpen(false)}
                aria-label={tr.closeLabel}
                className="min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center text-[#6C665F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              required
              autoFocus
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder={tr.listNamePlaceholder}
              className="w-full min-h-[46px] px-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
            />
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: "shopping", label: "🛍️" },
                  { id: "remember", label: "📝" },
                  { id: "selfcare", label: "🌱" },
                  { id: "gift", label: "🎁" },
                ] as { id: CustomList["icon"]; label: string }[]
              ).map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  onClick={() => setNewListIcon(ic.id)}
                  className={`min-h-[40px] rounded-xl text-base font-semibold border ${
                    newListIcon === ic.id
                      ? "bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724]"
                      : "bg-white dark:bg-[#1B191E] border-[#E5DFD3]"
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {PASTEL_SWATCHES.map((sw) => (
                <button
                  key={sw.id}
                  type="button"
                  onClick={() => setNewListPastel(sw.id)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    newListPastel === sw.id ? "border-[#2A2724] scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: sw.hex }}
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold"
            >
              {tr.createListBtn}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
