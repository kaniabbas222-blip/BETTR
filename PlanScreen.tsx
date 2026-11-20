import React, { useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Pencil, Plus, Trash2, X } from "lucide-react";
import { getTodayISO, PASTEL_CARD_CLASSES, PASTEL_SWATCHES } from "../data/defaults";
import {
  formatLocaleDate,
  formatLocaleNumber,
  formatMonthYear,
  getLocalizedWeekdays,
  t,
} from "../i18n/translations";
import type {
  AppLanguage,
  AppRegion,
  BirthdayPerson,
  PastelTone,
  ReminderSchedule,
  SavedPlace,
  SubView,
  TaskBucket,
  TaskCategory,
  TaskItem,
} from "../types/butter";
import { CategoryIcon, PlannerIcon, ReminderIcon } from "./CuteIcons";

interface PlanScreenProps {
  language: AppLanguage;
  region: AppRegion;
  tasks: TaskItem[];
  places: SavedPlace[];
  birthdays: BirthdayPerson[];
  onToggleTask: (id: string) => void;
  onAddTask: (payload: Omit<TaskItem, "id" | "completed">) => void;
  onUpdateTask: (id: string, patch: Partial<TaskItem>) => void;
  onDeleteTask: (id: string) => void;
  onOpenAskButter: () => void;
  onOpenSubView: (view: SubView) => void;
}

type PlanViewMode = "today" | "tomorrow" | "week" | "month";

export const PlanScreen: React.FC<PlanScreenProps> = ({
  language,
  region,
  tasks,
  places,
  birthdays,
  onToggleTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onOpenAskButter,
  onOpenSubView,
}) => {
  const tr = t(language);
  const [viewMode, setViewMode] = useState<PlanViewMode>("week");
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [selectedDateISO, setSelectedDateISO] = useState<string>(getTodayISO());

  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [creatingBucket, setCreatingBucket] = useState<TaskBucket | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formDateISO, setFormDateISO] = useState(getTodayISO());
  const [formCategory, setFormCategory] = useState<TaskCategory>("general");
  const [formPastel, setFormPastel] = useState<PastelTone>("sky");
  const [formReminder, setFormReminder] = useState(false);
  const [formSchedule, setFormSchedule] = useState<ReminderSchedule>("once");
  const [formPlaceId, setFormPlaceId] = useState<string>("");
  const [formIsEvent, setFormIsEvent] = useState(false);

  const openCreate = (bucket: TaskBucket, dateOverride?: string) => {
    setEditingTask(null);
    setCreatingBucket(bucket);
    setFormTitle("");
    setFormTime("");
    setFormDateISO(dateOverride || getTodayISO());
    setFormCategory("general");
    setFormPastel(bucket === "today" ? "yellow" : bucket === "tomorrow" ? "sky" : "sage");
    setFormReminder(false);
    setFormSchedule("once");
    setFormPlaceId(places[0]?.id || "");
    setFormIsEvent(false);
  };

  const openEdit = (task: TaskItem) => {
    setCreatingBucket(null);
    setEditingTask(task);
    setFormTitle(task.title);
    setFormTime(task.timeLabel);
    setFormDateISO(task.dateISO || getTodayISO());
    setFormCategory(task.category);
    setFormPastel(task.pastel);
    setFormReminder(task.reminder);
    setFormSchedule(task.reminderSchedule || "once");
    setFormPlaceId(task.locationPlaceId || places[0]?.id || "");
    setFormIsEvent(Boolean(task.isEvent));
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    if (editingTask) {
      onUpdateTask(editingTask.id, {
        title: formTitle.trim(),
        timeLabel: formTime.trim(),
        dateISO: formDateISO,
        category: formCategory,
        pastel: formPastel,
        reminder: formReminder,
        reminderSchedule: formReminder ? formSchedule : undefined,
        locationPlaceId: formReminder && formSchedule === "location" ? formPlaceId : undefined,
        isEvent: formIsEvent,
      });
      setEditingTask(null);
    } else if (creatingBucket) {
      onAddTask({
        title: formTitle.trim(),
        timeLabel: formTime.trim(),
        dateISO: formDateISO,
        bucket: creatingBucket,
        category: formCategory,
        pastel: formPastel,
        reminder: formReminder,
        reminderSchedule: formReminder ? formSchedule : undefined,
        locationPlaceId: formReminder && formSchedule === "location" ? formPlaceId : undefined,
        isEvent: formIsEvent,
      });
      setCreatingBucket(null);
    }
  };

  const cycleBucket = (task: TaskItem) => {
    const order: TaskBucket[] = ["today", "tomorrow", "week"];
    const next = order[(order.indexOf(task.bucket) + 1) % order.length];
    onUpdateTask(task.id, { bucket: next });
  };

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthTitle = formatMonthYear(monthCursor, language, region);
  const weekdays = getLocalizedWeekdays(language, region);

  const renderTaskCard = (task: TaskItem) => {
    const placeName = places.find((p) => p.id === task.locationPlaceId)?.name;
    return (
      <div
        key={task.id}
        className={`rounded-2xl border p-3.5 transition-all ${PASTEL_CARD_CLASSES[task.pastel]} ${
          task.completed ? "opacity-65" : ""
        }`}
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggleTask(task.id)}
            aria-label={task.title}
            className={`min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
              task.completed
                ? "bg-[#4A7C59] border-[#4A7C59] text-white"
                : "bg-white/85 dark:bg-black/20 border-[#CFC8BC] dark:border-white/20 text-transparent"
            }`}
          >
            <Check className="w-4 h-4" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6C665F] dark:text-[#C8C2B8]">
              {task.timeLabel && <span className="font-mono-num font-semibold">{task.timeLabel}</span>}
              {task.isEvent && <span>· {tr.eventTag}</span>}
              {task.reminder && (
                <span className="inline-flex items-center gap-1">
                  · <ReminderIcon className="w-3.5 h-3.5 inline" />{" "}
                  {task.reminderSchedule === "location" && placeName
                    ? `📍 ${placeName}`
                    : task.reminderSchedule
                      ? tr.schedules[task.reminderSchedule]
                      : tr.quickReminder}
                </span>
              )}
            </div>
            <p
              className={`text-sm sm:text-base font-semibold text-[#2A2724] dark:text-[#F7F4EE] mt-0.5 ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-white/75 dark:bg-black/20 flex items-center justify-center shrink-0">
            <CategoryIcon category={task.category} className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1.5 mt-2.5 pt-2 border-t border-black/5 dark:border-white/10">
          {task.reminder && (
            <button
              type="button"
              onClick={() => onUpdateTask(task.id, { reminder: false })}
              className="min-h-[44px] px-3 rounded-xl text-xs font-medium text-[#6C665F] hover:bg-white/70"
            >
              {tr.muteAlert}
            </button>
          )}
          <button
            type="button"
            onClick={() => cycleBucket(task)}
            className="min-h-[44px] px-3 rounded-xl text-xs font-medium text-[#5C564F] dark:text-[#C8C2B8] hover:bg-white/70 inline-flex items-center gap-1"
          >
            <span>{tr.moveBtn}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => openEdit(task)}
            aria-label={tr.editLabel}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#5C564F] hover:bg-white/70"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteTask(task.id)}
            aria-label={tr.deleteLabel}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#9E475B] hover:bg-white/70"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#DCEEF8] dark:bg-[#21303B] border border-[#C5E0F2] dark:border-white/10 flex items-center justify-center">
            <PlannerIcon className="w-8 h-8" active />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2A2724] dark:text-[#F7F4EE]">
              {tr.planTitle}
            </h1>
            <p className="text-sm text-[#6C665F] dark:text-[#B6AFA6]">
              {tr.planSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAskButter}
            className="min-h-[44px] px-4 rounded-2xl bg-[#EFEAF9] dark:bg-[#2D273B] text-sm font-semibold text-[#4C3B6E] dark:text-[#DCD2F2]"
          >
            {tr.askButter} ✨
          </button>
          <button
            type="button"
            onClick={() => openCreate("today")}
            className="min-h-[44px] px-4 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{tr.addPlan}</span>
          </button>
        </div>
      </div>

      {/* View Switcher + Related Routines */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="w-full sm:w-auto flex overflow-x-auto no-scrollbar p-1 rounded-2xl bg-[#F3EFE7] dark:bg-[#27252A] gap-1"
          role="tablist"
        >
          {(
            [
              { id: "today", label: tr.viewToday },
              { id: "tomorrow", label: tr.tomorrowLabel },
              { id: "week", label: tr.thisWeekLabel },
              { id: "month", label: tr.viewMonth },
            ] as { id: PlanViewMode; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={viewMode === tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`min-h-[44px] px-4 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
                viewMode === tab.id
                  ? "bg-white dark:bg-[#36333A] text-[#2A2724] dark:text-[#F7F4EE] shadow-sm"
                  : "text-[#6C665F] dark:text-[#B6AFA6]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onOpenSubView("homecare")}
            className="min-h-[44px] px-3.5 rounded-xl bg-[#E6F1E9] dark:bg-[#24332A] text-xs font-semibold"
          >
            {tr.tileHomeCare}
          </button>
          <button
            type="button"
            onClick={() => onOpenSubView("pack")}
            className="min-h-[44px] px-3.5 rounded-xl bg-[#FDF3CD] dark:bg-[#38321F] text-xs font-semibold"
          >
            {tr.tilePack}
          </button>
          <button
            type="button"
            onClick={() => onOpenSubView("automations")}
            className="min-h-[44px] px-3.5 rounded-xl bg-[#EFEAF9] dark:bg-[#2D273B] text-xs font-semibold"
          >
            {tr.tileAutomations}
          </button>
        </div>
      </div>

      {/* Views */}
      {(viewMode === "today" || viewMode === "tomorrow") && (
        <section className="rounded-3xl bg-white/85 dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">
              {viewMode === "today" ? tr.viewToday : tr.tomorrowLabel}
            </h2>
            <button
              type="button"
              onClick={() => openCreate(viewMode === "today" ? "today" : "tomorrow")}
              className="min-h-[40px] px-3 rounded-xl bg-[#FAF6EC] dark:bg-[#323036] text-xs font-semibold inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> {tr.add}
            </button>
          </div>
          {tasks.filter((tItem) => tItem.bucket === viewMode).length === 0 ? (
            <p className="text-sm text-[#6C665F] py-6 text-center">{tr.quietAndOpen}</p>
          ) : (
            <div className="space-y-2.5">
              {tasks.filter((tItem) => tItem.bucket === viewMode).map(renderTaskCard)}
            </div>
          )}
        </section>
      )}

      {viewMode === "week" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
          {(
            [
              { id: "today", label: tr.viewToday, subtitle: tr.rightNowSub },
              { id: "tomorrow", label: tr.tomorrowLabel, subtitle: tr.upNextSub },
              { id: "week", label: tr.thisWeekLabel, subtitle: tr.gentleHorizonSub },
            ] as { id: TaskBucket; label: string; subtitle: string }[]
          ).map((bucket) => {
            const list = tasks.filter((tItem) => tItem.bucket === bucket.id);
            return (
              <section
                key={bucket.id}
                className="rounded-3xl bg-white/85 dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-4 sm:p-5 space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold">{bucket.label}</h2>
                    <p className="text-xs text-[#6C665F] dark:text-[#B6AFA6]">{bucket.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCreate(bucket.id)}
                    aria-label={bucket.label}
                    className="min-w-[44px] min-h-[44px] rounded-2xl bg-[#FAF6EC] dark:bg-[#323036] flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {list.length === 0 ? (
                  <p className="text-sm text-[#6C665F] py-5 text-center">{tr.quietAndOpen}</p>
                ) : (
                  <div className="space-y-2.5">{list.map(renderTaskCard)}</div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {viewMode === "month" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">{monthTitle}</h2>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setMonthCursor(new Date(year, month - 1, 1))}
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-[#FAF8F4] dark:bg-[#1E1C21] flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setMonthCursor(new Date(year, month + 1, 1))}
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-[#FAF8F4] dark:bg-[#1E1C21] flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-[#6C665F]">
              {weekdays.map((d, i) => (
                <div key={i} className="py-1 truncate">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: firstDayOffset }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const mmdd = iso.slice(5);
                const dayTasks = tasks.filter((tItem) => tItem.dateISO === iso);
                const dayBirthdays = birthdays.filter((b) => b.dateMM_DD === mmdd);
                const isSelected = selectedDateISO === iso;
                const isToday = iso === getTodayISO();

                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setSelectedDateISO(iso)}
                    className={`min-h-[52px] rounded-2xl border p-1.5 flex flex-col items-center justify-between transition-all ${
                      isSelected
                        ? "bg-[#FDF1C7] dark:bg-[#4F472B] border-[#DFC97B]"
                        : isToday
                          ? "bg-[#DCEEF8]/70 dark:bg-[#21303B] border-[#A8CEE6]"
                          : "bg-[#FAF8F4] dark:bg-[#1E1C21] border-transparent hover:border-[#DFD8CA]"
                    }`}
                  >
                    <span className="font-mono-num text-xs font-bold">
                      {formatLocaleNumber(dayNum, language, region)}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {dayTasks.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#669977]" />}
                      {dayBirthdays.length > 0 && <span className="text-[10px]">🎂</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-5 rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-base font-bold">
                  {formatLocaleDate(selectedDateISO, language, region, "short")}
                </h3>
                <p className="text-xs text-[#6C665F]">{tr.plansBirthdaysThisDay}</p>
              </div>
              <button
                type="button"
                onClick={() => openCreate("week", selectedDateISO)}
                className="min-h-[44px] px-3.5 rounded-xl bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724] text-xs font-semibold inline-flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> {tr.add}
              </button>
            </div>

            {birthdays
              .filter((b) => b.dateMM_DD === selectedDateISO.slice(5))
              .map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl bg-[#FCEAF0] dark:bg-[#39252D] border border-[#F2CEDB] p-3.5 text-sm font-semibold"
                >
                  🎂 {b.name} {b.giftIdea ? `· 🎁 ${b.giftIdea}` : ""}
                </div>
              ))}

            {tasks.filter((tItem) => tItem.dateISO === selectedDateISO).length === 0 ? (
              <p className="text-sm text-[#6C665F] py-6 text-center">{tr.noPlansThisDay}</p>
            ) : (
              <div className="space-y-2.5">
                {tasks.filter((tItem) => tItem.dateISO === selectedDateISO).map(renderTaskCard)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(creatingBucket !== null || editingTask !== null) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSaveModal}
            className="w-full sm:max-w-md bg-[#FDFBF7] dark:bg-[#232126] rounded-t-3xl sm:rounded-3xl border border-[#EAE4D8] dark:border-white/10 shadow-xl p-5 pb-sheet-safe sm:pb-5 max-h-[92dvh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">
                {editingTask ? tr.editPlanModalTitle : tr.newPlanModalTitle}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setCreatingBucket(null);
                  setEditingTask(null);
                }}
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
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder={tr.planTitlePlaceholder}
              className="w-full min-h-[46px] px-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                placeholder={tr.planTimePlaceholder}
                className="min-h-[44px] px-3.5 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
              />
              <input
                type="date"
                value={formDateISO}
                onChange={(e) => setFormDateISO(e.target.value)}
                className="min-h-[44px] px-3.5 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm font-mono-num"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as TaskCategory)}
                className="min-h-[44px] px-3.5 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
              >
                {(["general", "school", "homework", "shopping", "selfcare", "errand"] as TaskCategory[]).map(
                  (cat) => (
                    <option key={cat} value={cat}>
                      {tr.taskCategories[cat]}
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                onClick={() => setFormIsEvent((v) => !v)}
                className={`min-h-[44px] px-3 rounded-2xl text-xs font-semibold border ${
                  formIsEvent
                    ? "bg-[#DCEEF8] border-[#A8CEE6] text-[#1F3A4D]"
                    : "bg-white dark:bg-[#1B191E] border-[#E5DFD3] dark:border-white/10 text-[#6C665F]"
                }`}
              >
                {formIsEvent ? tr.calendarEventBtn : tr.personalTaskBtn}
              </button>
            </div>

            {/* Smart Reminder Options */}
            <div className="rounded-2xl bg-[#FAF8F4] dark:bg-[#1B191E] p-3.5 space-y-2.5 border border-[#EAE4D8] dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{tr.smartReminderLabel}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formReminder}
                  onClick={() => setFormReminder((r) => !r)}
                  className={`min-w-[48px] min-h-[30px] rounded-full p-1 transition-colors ${
                    formReminder ? "bg-[#669977]" : "bg-[#D8D2C8]"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      formReminder ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              {formReminder && (
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formSchedule}
                    onChange={(e) => setFormSchedule(e.target.value as ReminderSchedule)}
                    className="min-h-[40px] px-3 rounded-xl bg-white dark:bg-[#27252A] border border-[#E5DFD3] dark:border-white/10 text-xs font-medium"
                  >
                    {(Object.keys(tr.schedules) as ReminderSchedule[]).map((sched) => (
                      <option key={sched} value={sched}>
                        {tr.schedules[sched]}
                      </option>
                    ))}
                  </select>
                  {formSchedule === "location" && (
                    <select
                      value={formPlaceId}
                      onChange={(e) => setFormPlaceId(e.target.value)}
                      className="min-h-[40px] px-3 rounded-xl bg-white dark:bg-[#27252A] border border-[#E5DFD3] dark:border-white/10 text-xs font-medium"
                    >
                      {places.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.emoji} {p.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {PASTEL_SWATCHES.map((sw) => (
                <button
                  key={sw.id}
                  type="button"
                  aria-label={sw.label}
                  onClick={() => setFormPastel(sw.id)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formPastel === sw.id ? "border-[#2A2724] dark:border-white scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: sw.hex }}
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold"
            >
              {editingTask ? tr.saveChanges : tr.addToPlan}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
