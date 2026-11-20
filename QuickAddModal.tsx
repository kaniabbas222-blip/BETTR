import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PASTEL_SWATCHES } from "../data/defaults";
import { t } from "../i18n/translations";
import type { AppLanguage, PastelTone, TaskBucket, TaskCategory } from "../types/butter";

interface QuickAddModalProps {
  isOpen: boolean;
  language: AppLanguage;
  initialMode: "task" | "reminder";
  onClose: () => void;
  onAddTask: (payload: {
    title: string;
    timeLabel: string;
    bucket: TaskBucket;
    category: TaskCategory;
    pastel: PastelTone;
    reminder: boolean;
  }) => void;
}

const CATEGORY_KEYS: TaskCategory[] = [
  "general",
  "school",
  "homework",
  "shopping",
  "selfcare",
  "errand",
];

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  language,
  initialMode,
  onClose,
  onAddTask,
}) => {
  const tr = t(language);
  const [title, setTitle] = useState("");
  const [timeLabel, setTimeLabel] = useState("");
  const [bucket, setBucket] = useState<TaskBucket>("today");
  const [category, setCategory] = useState<TaskCategory>("general");
  const [pastel, setPastel] = useState<PastelTone>("yellow");
  const [reminder, setReminder] = useState(initialMode === "reminder");

  useEffect(() => {
    setReminder(initialMode === "reminder");
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      timeLabel: timeLabel.trim(),
      bucket,
      category,
      pastel,
      reminder,
    });
    setTitle("");
    setTimeLabel("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-add-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-md bg-[#FDFBF7] dark:bg-[#232126] rounded-t-3xl sm:rounded-3xl border border-[#EAE4D8] dark:border-white/10 shadow-xl pb-[env(safe-area-inset-bottom,0px)] sm:pb-0 max-h-[92dvh] overflow-y-auto"
      >
        <div className="w-10 h-1.5 rounded-full bg-[#DAD4C8] dark:bg-[#4B4750] mx-auto mt-3 sm:hidden" />

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#EFEAE0] dark:border-white/10">
          <h2 id="quick-add-title" className="font-display text-lg font-bold text-[#2A2724] dark:text-[#F7F4EE]">
            {reminder ? tr.quickNewReminder : tr.quickAddSomething}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={tr.closeLabel}
            className="min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center text-[#6C665F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label htmlFor="quick-title" className="block text-xs font-semibold text-[#6C665F] dark:text-[#B6AFA6] mb-1.5">
              {tr.quickWhatTodo}
            </label>
            <input
              id="quick-title"
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={tr.planTitlePlaceholder}
              className="w-full min-h-[46px] px-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm text-[#2A2724] dark:text-[#F7F4EE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="quick-time" className="block text-xs font-semibold text-[#6C665F] dark:text-[#B6AFA6] mb-1.5">
                {tr.quickTimeOpt}
              </label>
              <input
                id="quick-time"
                type="text"
                value={timeLabel}
                onChange={(e) => setTimeLabel(e.target.value)}
                placeholder={tr.planTimePlaceholder}
                className="w-full min-h-[44px] px-3.5 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm text-[#2A2724] dark:text-[#F7F4EE]"
              />
            </div>

            <div>
              <label htmlFor="quick-bucket" className="block text-xs font-semibold text-[#6C665F] dark:text-[#B6AFA6] mb-1.5">
                {tr.quickWhen}
              </label>
              <select
                id="quick-bucket"
                value={bucket}
                onChange={(e) => setBucket(e.target.value as TaskBucket)}
                className="w-full min-h-[44px] px-3.5 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm text-[#2A2724] dark:text-[#F7F4EE]"
              >
                <option value="today">{tr.viewToday}</option>
                <option value="tomorrow">{tr.tomorrowLabel}</option>
                <option value="week">{tr.thisWeekLabel}</option>
              </select>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#6C665F] dark:text-[#B6AFA6] mb-2">
              {tr.quickCategory}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_KEYS.map((catKey) => (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setCategory(catKey)}
                  className={`min-h-[44px] px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    category === catKey
                      ? "bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724] border-transparent"
                      : "bg-white dark:bg-[#1B191E] border-[#E5DFD3] dark:border-white/10 text-[#5C564F] dark:text-[#C8C2B8]"
                  }`}
                >
                  {tr.taskCategories[catKey]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {PASTEL_SWATCHES.map((sw) => (
                <button
                  key={sw.id}
                  type="button"
                  aria-label={sw.label}
                  onClick={() => setPastel(sw.id)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    pastel === sw.id ? "border-[#2A2724] dark:border-white scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: sw.hex }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setReminder((r) => !r)}
              className={`min-h-[44px] px-3.5 rounded-xl text-xs font-semibold border transition-colors ${
                reminder
                  ? "bg-[#FCEAF0] dark:bg-[#492832] border-[#E7B6C5] text-[#6E273A] dark:text-[#FFD6E1]"
                  : "bg-white dark:bg-[#1B191E] border-[#E5DFD3] dark:border-white/10 text-[#6C665F]"
              }`}
            >
              {reminder ? tr.quickReminderOn : tr.quickNoReminder}
            </button>
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold text-base"
          >
            {tr.quickSaveBtn}
          </button>
        </div>
      </form>
    </div>
  );
};
