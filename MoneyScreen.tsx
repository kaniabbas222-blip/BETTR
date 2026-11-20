import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { getTodayISO, PASTEL_CARD_CLASSES } from "../data/defaults";
import {
  fmt,
  formatLocaleDate,
  formatLocaleMoney,
  formatLocaleNumber,
  t,
} from "../i18n/translations";
import type {
  AppLanguage,
  AppRegion,
  ExpenseCategory,
  ExpenseItem,
  SavingsGoal,
} from "../types/butter";
import { FoodIcon, MoneyIcon, SelfCareIcon, ShoppingIcon } from "./CuteIcons";

interface MoneyScreenProps {
  language: AppLanguage;
  region: AppRegion;
  currency: "IQD" | "USD" | "EUR";
  expenses: ExpenseItem[];
  goals: SavingsGoal[];
  onAddExpense: (payload: Omit<ExpenseItem, "id">) => void;
  onDeleteExpense: (id: string) => void;
  onAddGoal: (title: string, targetAmount: number) => void;
  onContributeGoal: (goalId: string, amount: number) => void;
  onChangeCurrency: (c: "IQD" | "USD" | "EUR") => void;
  onBack?: () => void;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Shopping",
  "Transport",
  "Fun",
  "Bills",
  "Self-Care",
];

const CATEGORY_BAR_COLORS: Record<ExpenseCategory, string> = {
  Food: "#F4C96B",
  Shopping: "#F0A8BE",
  Transport: "#9CC9E8",
  Fun: "#C4B4E8",
  Bills: "#B9B2A8",
  "Self-Care": "#98C9A9",
};

export const MoneyScreen: React.FC<MoneyScreenProps> = ({
  language,
  region,
  currency,
  expenses,
  goals,
  onAddExpense,
  onDeleteExpense,
  onAddGoal,
  onContributeGoal,
  onChangeCurrency,
  onBack,
}) => {
  const tr = t(language);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [note, setNote] = useState("");

  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");

  const todayISO = getTodayISO();
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);
  const currentMonthPrefix = todayISO.slice(0, 7);

  const todayTotal = expenses
    .filter((e) => e.dateISO === todayISO)
    .reduce((sum, e) => sum + e.amount, 0);

  const weekTotal = expenses
    .filter((e) => new Date(e.dateISO) >= weekAgo)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthTotal = expenses
    .filter((e) => e.dateISO.startsWith(currentMonthPrefix))
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = EXPENSE_CATEGORIES.map((cat) => ({
    category: cat,
    total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0);
  const maxCatTotal = Math.max(1, ...categoryTotals.map((c) => c.total));

  const quickDepositStep = currency === "IQD" ? 5000 : 10;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label={tr.back}
              className="min-w-[44px] min-h-[44px] rounded-2xl bg-[#F3EFE7] dark:bg-[#27252A] flex items-center justify-center text-[#2A2724] dark:text-[#F7F4EE]"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
          )}
          <div className="w-12 h-12 rounded-2xl bg-[#E6F1E9] dark:bg-[#24332A] border border-[#C9E0D0] dark:border-white/10 flex items-center justify-center">
            <MoneyIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2A2724] dark:text-[#F7F4EE]">
              {tr.moneyTitle}
            </h1>
            <p className="text-sm text-[#6C665F] dark:text-[#B6AFA6]">
              {tr.moneySub}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label={tr.currencyLabel}
            value={currency}
            onChange={(e) => onChangeCurrency(e.target.value as "IQD" | "USD" | "EUR")}
            className="min-h-[44px] px-3 rounded-2xl bg-white dark:bg-[#27252A] border border-[#E5DFD3] dark:border-white/15 text-xs font-bold"
          >
            <option value="IQD">IQD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <button
            type="button"
            onClick={() => setShowAddExpense(true)}
            className="min-h-[44px] px-4 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{tr.addSpending}</span>
          </button>
        </div>
      </div>

      {/* Spending Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl p-5 border bg-[#FDF3CD] dark:bg-[#38321F] border-[#F2E09E] dark:border-[#4F472B]">
          <p className="text-xs font-semibold text-[#6C665F] dark:text-[#D5C99F]">{tr.todaySpending}</p>
          <p className="font-mono-num text-2xl font-bold text-[#2A2724] dark:text-[#FDF1C7] mt-1.5">
            {formatLocaleMoney(todayTotal, currency, language, region)}
          </p>
        </div>
        <div className="rounded-3xl p-5 border bg-[#E3F1FA] dark:bg-[#21303B] border-[#C5E0F2] dark:border-[#304554]">
          <p className="text-xs font-semibold text-[#6C665F] dark:text-[#B6D1E2]">{tr.thisWeekSpending}</p>
          <p className="font-mono-num text-2xl font-bold text-[#2A2724] dark:text-[#E3F1FA] mt-1.5">
            {formatLocaleMoney(weekTotal, currency, language, region)}
          </p>
        </div>
        <div className="rounded-3xl p-5 border bg-[#E6F1E9] dark:bg-[#24332A] border-[#C9E0D0] dark:border-[#344A3C]">
          <p className="text-xs font-semibold text-[#6C665F] dark:text-[#B6D4BF]">{tr.thisMonthSpending}</p>
          <p className="font-mono-num text-2xl font-bold text-[#2A2724] dark:text-[#E6F1E9] mt-1.5">
            {formatLocaleMoney(monthTotal, currency, language, region)}
          </p>
        </div>
      </div>

      {/* Simple Category Chart */}
      {categoryTotals.length > 0 && (
        <section className="rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-3">
          <h2 className="font-display text-base font-bold text-[#2A2724] dark:text-[#F7F4EE]">
            {tr.spendingByCategory}
          </h2>
          <div className="space-y-2.5">
            {categoryTotals.map((c) => {
              const pct = Math.max(8, Math.round((c.total / maxCatTotal) * 100));
              return (
                <div key={c.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{tr.expenseCategories[c.category]}</span>
                    <span className="font-mono-num">
                      {formatLocaleMoney(c.total, currency, language, region)}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#F3EFE7] dark:bg-black/25 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CATEGORY_BAR_COLORS[c.category],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Spending + Savings Goals */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <section className="md:col-span-7 rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-3.5">
          <h2 className="font-display text-lg font-bold">{tr.recentSpending}</h2>
          {expenses.length === 0 ? (
            <p className="text-sm text-[#6C665F] py-6 text-center">{tr.noSpendingYet}</p>
          ) : (
            <div className="space-y-2.5">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-2xl bg-[#FAF8F4] dark:bg-[#1E1C21] border border-[#EDE7DC] dark:border-white/10 p-3.5 flex items-center gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#2A272F] flex items-center justify-center shrink-0">
                    {exp.category === "Food" ? (
                      <FoodIcon className="w-6 h-6" />
                    ) : exp.category === "Shopping" ? (
                      <ShoppingIcon className="w-6 h-6" />
                    ) : exp.category === "Self-Care" ? (
                      <SelfCareIcon className="w-6 h-6" />
                    ) : (
                      <MoneyIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {tr.expenseCategories[exp.category]}
                      {exp.note ? ` · ${exp.note}` : ""}
                    </p>
                    <p className="text-xs text-[#6C665F]">
                      {formatLocaleDate(exp.dateISO, language, region, "short")}
                    </p>
                  </div>
                  <p className="font-mono-num text-sm font-bold shrink-0">
                    {formatLocaleMoney(exp.amount, currency, language, region)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onDeleteExpense(exp.id)}
                    aria-label={tr.deleteLabel}
                    className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#9E475B]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="md:col-span-5 rounded-3xl bg-white dark:bg-[#27252A] border border-[#EAE4D8] dark:border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">{tr.savingsGoals}</h2>
            <button
              type="button"
              onClick={() => setShowAddGoal(true)}
              className="min-h-[44px] px-3.5 rounded-xl bg-[#FAF6EC] dark:bg-[#323036] text-xs font-semibold inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{tr.newGoal}</span>
            </button>
          </div>

          <div className="space-y-3">
            {goals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
              return (
                <div
                  key={goal.id}
                  className={`rounded-2xl border p-4 space-y-3 ${PASTEL_CARD_CLASSES[goal.pastel]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">{goal.title}</p>
                      <p className="text-xs text-[#6C665F] dark:text-[#C8C2B8] font-mono-num mt-0.5">
                        {formatLocaleMoney(goal.savedAmount, currency, language, region)} /{" "}
                        {formatLocaleMoney(goal.targetAmount, currency, language, region)}
                      </p>
                    </div>
                    <span className="font-mono-num text-sm font-bold text-[#4A7C59] dark:text-[#A9D6B6]">
                      {formatLocaleNumber(pct, language, region)}%
                    </span>
                  </div>
                  <div className="w-full h-3.5 rounded-full bg-white/80 dark:bg-black/25 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-[#669977] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onContributeGoal(goal.id, quickDepositStep)}
                    className="w-full min-h-[40px] rounded-xl bg-white/85 dark:bg-black/20 text-xs font-semibold"
                  >
                    {fmt(tr.saveQuickStep, {
                      amount: formatLocaleMoney(quickDepositStep, currency, language, region),
                    })}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const numeric = Number(amount);
              if (!numeric || numeric <= 0) return;
              onAddExpense({ amount: numeric, category, note: note.trim(), dateISO: todayISO });
              setAmount("");
              setNote("");
              setShowAddExpense(false);
            }}
            className="w-full sm:max-w-md bg-[#FDFBF7] dark:bg-[#232126] rounded-t-3xl sm:rounded-3xl border border-[#EAE4D8] dark:border-white/10 shadow-xl p-5 pb-sheet-safe sm:pb-5 max-h-[92dvh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{tr.logSpendingTitle}</h3>
              <button
                type="button"
                onClick={() => setShowAddExpense(false)}
                aria-label={tr.closeLabel}
                className="min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center text-[#6C665F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="number"
              required
              autoFocus
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`${tr.amountLabel} (${currency})`}
              className="w-full min-h-[46px] px-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 font-mono-num text-base font-semibold"
            />
            <div className="grid grid-cols-3 gap-2">
              {EXPENSE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`min-h-[40px] rounded-xl text-xs font-semibold border ${
                    category === cat
                      ? "bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724]"
                      : "bg-white dark:bg-[#1B191E] border-[#E5DFD3]"
                  }`}
                >
                  {tr.expenseCategories[cat]}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={tr.optionalNotePlaceholder}
              className="w-full min-h-[44px] px-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
            />
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold"
            >
              {tr.saveSpending}
            </button>
          </form>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = Number(goalTarget);
              if (!goalTitle.trim() || !target || target <= 0) return;
              onAddGoal(goalTitle.trim(), target);
              setGoalTitle("");
              setGoalTarget("");
              setShowAddGoal(false);
            }}
            className="w-full sm:max-w-md bg-[#FDFBF7] dark:bg-[#232126] rounded-t-3xl sm:rounded-3xl border border-[#EAE4D8] dark:border-white/10 shadow-xl p-5 pb-sheet-safe sm:pb-5 max-h-[92dvh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{tr.newSavingsGoalTitle}</h3>
              <button
                type="button"
                onClick={() => setShowAddGoal(false)}
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
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder={tr.whatSavingFor}
              className="w-full min-h-[46px] px-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 text-sm"
            />
            <input
              type="number"
              required
              min="1"
              step="any"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              placeholder={`${tr.targetAmount} (${currency})`}
              className="w-full min-h-[46px] px-4 rounded-2xl bg-white dark:bg-[#1B191E] border border-[#E5DFD3] dark:border-white/15 font-mono-num text-sm"
            />
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold"
            >
              {tr.createGoal}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
