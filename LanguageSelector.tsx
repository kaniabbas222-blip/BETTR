import React from "react";
import { ArrowLeft, Check } from "lucide-react";
import { PASTEL_CARD_CLASSES } from "../data/defaults";
import { LANGUAGES, t } from "../i18n/translations";
import type { AppLanguage } from "../types/butter";
import { BetterLogoIcon } from "./CuteIcons";

interface LanguageSelectorProps {
  selectedLanguage: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  mode: "onboarding" | "settings";
  onBack?: () => void;
  onContinue?: () => void;
  onSkip?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  mode,
  onBack,
  onContinue,
  onSkip,
}) => {
  const tr = t(selectedLanguage);

  return (
    <div
      className={
        mode === "onboarding"
          ? "min-h-[100dvh] w-full bg-[#FDFBF7] dark:bg-[#1D1B1E] flex flex-col items-center justify-between px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-10 relative overflow-hidden"
          : "space-y-6"
      }
    >
      {mode === "onboarding" && (
        <>
          <div className="butter-bubble w-32 h-32 -top-8 -end-8 absolute opacity-55 pointer-events-none" />
          <div className="butter-bubble w-20 h-20 bottom-20 -start-6 absolute opacity-45 pointer-events-none" />
        </>
      )}

      {/* Header */}
      <div className={mode === "onboarding" ? "w-full max-w-2xl" : "w-full"}>
        {mode === "onboarding" ? (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BetterLogoIcon className="w-8 h-8" />
              <span className="font-display font-bold text-lg tracking-tight text-[#2A2724] dark:text-[#F7F4EE]">
                BETTER
              </span>
            </div>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="min-h-[44px] px-4 text-sm font-medium text-[#6C665F] dark:text-[#B6AFA6] hover:text-[#2A2724] dark:hover:text-white transition-colors"
              >
                {tr.skip}
              </button>
            )}
          </div>
        ) : (
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
            <div className="w-11 h-11 rounded-2xl bg-[#FDF3CD] dark:bg-[#38321F] flex items-center justify-center text-xl">
              🌍
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[#2A2724] dark:text-[#F7F4EE]">
                {tr.chooseLanguageTitle}
              </h1>
              <p className="text-xs sm:text-sm text-[#6C665F] dark:text-[#B6AFA6]">
                {tr.chooseLanguageSub}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Selection Grid */}
      <div className={mode === "onboarding" ? "w-full max-w-2xl my-auto py-3 space-y-5" : "space-y-4"}>
        {mode === "onboarding" && (
          <div className="text-center space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2A2724] dark:text-[#F7F4EE]">
              {tr.chooseLanguageTitle}
            </h1>
            <p className="text-sm text-[#6C665F] dark:text-[#B6AFA6] max-w-md mx-auto">
              {tr.chooseLanguageSub}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => {
            const selected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => onSelectLanguage(lang.id)}
                aria-pressed={selected}
                className={`min-h-[64px] rounded-2xl border p-3.5 px-4 flex items-center justify-between gap-3 transition-all text-start active:scale-[0.99] ${
                  selected
                    ? `${PASTEL_CARD_CLASSES[lang.pastel]} ring-2 ring-[#2A2724] dark:ring-[#FDF1C7] shadow-sm`
                    : "bg-white/90 dark:bg-[#27252A] border-[#EAE4D8] dark:border-white/10 hover:bg-[#FAF6EC] dark:hover:bg-[#302D34]"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className="w-11 h-11 rounded-2xl bg-white/85 dark:bg-black/25 border border-black/5 dark:border-white/10 flex items-center justify-center text-2xl shrink-0"
                    aria-hidden="true"
                  >
                    {lang.flag}
                  </span>
                  <div className="min-w-0">
                    <p
                      dir={lang.dir}
                      className="font-display text-base font-bold text-[#2A2724] dark:text-[#F7F4EE] truncate"
                    >
                      {lang.nativeName}
                    </p>
                    <p className="text-xs text-[#6C665F] dark:text-[#B6AFA6] truncate">
                      {lang.englishName} · {lang.dir.toUpperCase()}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    selected
                      ? "bg-[#2A2724] dark:bg-[#FDF1C7] text-white dark:text-[#2A2724]"
                      : "bg-[#F3EFE7] dark:bg-[#1E1C21] text-transparent"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-center text-[#6C665F] dark:text-[#B6AFA6]">
          {tr.changeLaterNote}
        </p>
      </div>

      {/* Onboarding Footer */}
      {mode === "onboarding" && onContinue && (
        <div className="w-full max-w-2xl pt-4">
          <button
            type="button"
            onClick={onContinue}
            className="w-full min-h-[48px] px-6 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold text-base shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
          >
            {tr.continueBtn}
          </button>
        </div>
      )}
    </div>
  );
};
