import React, { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { fmt, formatLocaleNumber, getLanguageMeta, t } from "../i18n/translations";
import type {
  AppLanguage,
  ParsedButterItem,
  ReminderSchedule,
  TaskBucket,
  TaskCategory,
} from "../types/butter";
import { CategoryIcon, MagicWandIcon } from "./CuteIcons";

interface AskButterModalProps {
  isOpen: boolean;
  language: AppLanguage;
  currency: string;
  scheduleSummary?: string;
  onClose: () => void;
  onSaveItems: (items: ParsedButterItem[]) => void;
}

export const AskButterModal: React.FC<AskButterModalProps> = ({
  isOpen,
  language,
  currency,
  scheduleSummary = "",
  onClose,
  onSaveItems,
}) => {
  const tr = t(language);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [clarification, setClarification] = useState<string | null>(null);
  const [items, setItems] = useState<ParsedButterItem[]>([]);

  if (!isOpen) return null;

  const handleAnalyze = async (textOverride?: string) => {
    const query = (textOverride ?? input).trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setClarification(null);
    try {
      const res = await fetch("/api/ask-better", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          currency,
          language: getLanguageMeta(language).englishName,
          scheduleContext: scheduleSummary,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || tr.errorGeneric);
      }
      const parsedItems: ParsedButterItem[] = Array.isArray(data.items)
        ? data.items.map((item: Record<string, unknown>, idx: number) => ({
            id: `parsed-${Date.now()}-${idx}`,
            title: String(item.title || ""),
            timeLabel: String(item.timeLabel || ""),
            bucket: (["today", "tomorrow", "week"].includes(String(item.bucket))
              ? item.bucket
              : "today") as TaskBucket,
            destination: (["plan", "shopping", "note", "money", "reminder"].includes(
              String(item.destination)
            )
              ? item.destination
              : "plan") as ParsedButterItem["destination"],
            category: (item.category || "general") as TaskCategory,
            reminder: Boolean(item.reminder),
            recurrence: (item.recurrence || "once") as ReminderSchedule,
            locationTrigger: typeof item.locationTrigger === "string" ? item.locationTrigger : undefined,
            amount: typeof item.amount === "number" ? item.amount : undefined,
            note: typeof item.note === "string" ? item.note : undefined,
            selected: true,
          }))
        : [];

      setReply(data.reply || "");
      setClarification(
        typeof data.clarificationQuestion === "string" && data.clarificationQuestion.trim()
          ? data.clarificationQuestion.trim()
          : null
      );
      setItems(parsedItems);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : tr.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (id: string, patch: Partial<ParsedButterItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const handleSave = () => {
    const chosen = items.filter((it) => it.selected && it.title.trim());
    if (chosen.length === 0) return;
    onSaveItems(chosen);
    setInput("");
    setItems([]);
    setReply(null);
    setClarification(null);
    onClose();
  };

  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-butter-title"
    >
      <div className="w-full sm:max-w-xl bg-[#FDFBF7] dark:bg-[#232126] rounded-t-3xl sm:rounded-3xl border border-[#EAE4D8] dark:border-white/10 shadow-xl max-h-[92dvh] pb-[env(safe-area-inset-bottom,0px)] sm:pb-0 flex flex-col overflow-hidden">
        <div className="w-10 h-1.5 rounded-full bg-[#DAD4C8] dark:bg-[#4B4750] mx-auto mt-3 sm:hidden" />

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#EFEAE0] dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFEAF9] dark:bg-[#3A314E] flex items-center justify-center">
              <MagicWandIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 id="ask-butter-title" className="font-display text-lg font-bold">
                {tr.askButter} ✨
              </h2>
              <p className="text-xs text-[#6C665F] dark:text-[#B6AFA6]">
                {tr.askButterSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tr.closeLabel}
            className="min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center text-[#6C665F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tr.askButterPlaceholder}
              className="w-full p-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm sm:text-base resize-none"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setInput(tr.askButterExample1);
                    handleAnalyze(tr.askButterExample1);
                  }}
                  className="min-h-[36px] px-3 rounded-xl bg-[#FDF1C7] dark:bg-[#38321F] text-xs font-medium text-[#4A3E18] dark:text-[#FDF1C7]"
                >
                  {tr.askButterChip1}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput(tr.askButterExample2);
                    handleAnalyze(tr.askButterExample2);
                  }}
                  className="min-h-[36px] px-3 rounded-xl bg-[#FDF1C7] dark:bg-[#38321F] text-xs font-medium text-[#4A3E18] dark:text-[#FDF1C7]"
                >
                  {tr.askButterChip2}
                </button>
              </div>
              <button
                type="button"
                disabled={loading || !input.trim()}
                onClick={() => handleAnalyze()}
                className="min-h-[44px] px-5 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-45 shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{tr.organizeBtn}</span>}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-[#FCE6EC] dark:bg-[#492832] border border-[#F0C1CE] p-4 text-sm text-[#6E273A] dark:text-[#FFD6E1]">
              {error}
            </div>
          )}

          {clarification && (
            <div className="rounded-2xl bg-[#FDF3CD]/85 dark:bg-[#38321F] border border-[#F2E09E] p-3.5 text-xs sm:text-sm font-medium text-[#4A3E18] dark:text-[#FDF1C7]">
              💬 {clarification}
            </div>
          )}

          {reply && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-[#4A7C59] dark:text-[#A9D6B6]">{reply}</p>
              {items.length > 0 && (
                <p className="text-xs text-[#6C665F] dark:text-[#B6AFA6]">
                  {tr.confirmEditNote}
                </p>
              )}

              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl p-3.5 border transition-all ${
                    item.selected
                      ? "bg-white dark:bg-[#2C2A30] border-[#DFD8CA] dark:border-white/15"
                      : "bg-[#F5F2EC] dark:bg-[#1D1B1E] border-transparent opacity-55"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF6EC] dark:bg-black/25 flex items-center justify-center shrink-0 mt-0.5">
                      <CategoryIcon category={item.category} className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF8F4] dark:bg-[#1D1B1E] border border-[#EAE4D8] dark:border-white/10 text-sm font-semibold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={item.timeLabel}
                          placeholder={tr.planTimePlaceholder}
                          onChange={(e) => updateItem(item.id, { timeLabel: e.target.value })}
                          className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F4] dark:bg-[#1D1B1E] border border-[#EAE4D8] dark:border-white/10 text-xs"
                        />
                        <select
                          value={item.destination}
                          onChange={(e) =>
                            updateItem(item.id, {
                              destination: e.target.value as ParsedButterItem["destination"],
                            })
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F4] dark:bg-[#1D1B1E] border border-[#EAE4D8] dark:border-white/10 text-xs font-medium"
                        >
                          <option value="plan">{tr.destPlan}</option>
                          <option value="reminder">{tr.destReminder}</option>
                          <option value="shopping">{tr.destShopping}</option>
                          <option value="note">{tr.destNote}</option>
                          <option value="money">{tr.destMoney}</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateItem(item.id, { selected: !item.selected })}
                      aria-label={item.title}
                      className={`min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center border shrink-0 ${
                        item.selected
                          ? "bg-[#4A7C59] border-[#4A7C59] text-white"
                          : "bg-transparent border-[#CFC8BC] text-transparent"
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-[#EFEAE0] dark:border-white/10 bg-white/80 dark:bg-[#1E1C21]">
            <button
              type="button"
              onClick={handleSave}
              className="w-full min-h-[48px] rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold"
            >
              {fmt(tr.confirmSaveItems, {
                count: formatLocaleNumber(selectedCount, language, "auto"),
              })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
