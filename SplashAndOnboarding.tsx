import React, { useEffect, useState } from "react";
import { t } from "../i18n/translations";
import type { AppLanguage } from "../types/butter";
import { BetterLogoIcon, MagicWandIcon, PlannerIcon, SelfCareIcon } from "./CuteIcons";
import { LanguageSelector } from "./LanguageSelector";

interface SplashAndOnboardingProps {
  stage: "splash" | "onboarding";
  language: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  onFinishSplash: () => void;
  onFinishOnboarding: () => void;
  reducedMotion?: boolean;
}

export const SplashAndOnboarding: React.FC<SplashAndOnboardingProps> = ({
  stage,
  language,
  onSelectLanguage,
  onFinishSplash,
  onFinishOnboarding,
  reducedMotion = false,
}) => {
  // Step 0 = Language selection screen ("Choose your language 🌍"), Steps 1..3 = 3 onboarding slides
  const [step, setStep] = useState(0);
  const tr = t(language);

  useEffect(() => {
    if (stage !== "splash") return;
    const timer = window.setTimeout(() => {
      onFinishSplash();
    }, reducedMotion ? 900 : 1900);
    return () => window.clearTimeout(timer);
  }, [stage, onFinishSplash, reducedMotion]);

  if (stage === "splash") {
    return (
      <div
        onClick={onFinishSplash}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onFinishSplash();
        }}
        aria-label="BETTER splash screen, tap to continue"
        className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#FDFBF7] dark:bg-[#1D1B1E] px-6 pt-header-safe pb-sheet-safe relative overflow-hidden cursor-pointer select-none"
      >
        <div className="butter-bubble w-24 h-24 absolute top-16 start-10 opacity-70 animate-float-gentle" />
        <div className="butter-bubble w-14 h-14 absolute bottom-24 end-12 opacity-65 animate-float-gentle" />
        <div className="butter-bubble w-10 h-10 absolute top-1/3 end-1/4 opacity-50" />

        <div className="relative flex flex-col items-center text-center max-w-xs">
          <span className="absolute -top-6 -start-6 text-xl animate-float-gentle" aria-hidden="true">
            🌱
          </span>
          <span className="absolute -top-5 -end-7 text-xl animate-float-gentle" aria-hidden="true">
            ✨
          </span>
          <span className="absolute bottom-14 -end-9 text-lg animate-float-gentle" aria-hidden="true">
            🫧
          </span>

          <div className="w-24 h-24 rounded-3xl bg-[#FDF1C7] dark:bg-[#3A331E] border border-[#EFE0A4] dark:border-[#53492B] flex items-center justify-center shadow-sm mb-6">
            <BetterLogoIcon className="w-16 h-16" />
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#2A2724] dark:text-[#F7F4EE]">
            BETTER
          </h1>
          <p className="mt-2 text-base text-[#6C665F] dark:text-[#B6AFA6]">
            {tr.splashTagline}
          </p>
        </div>
      </div>
    );
  }

  if (step === 0) {
    return (
      <LanguageSelector
        selectedLanguage={language}
        onSelectLanguage={onSelectLanguage}
        mode="onboarding"
        onContinue={() => setStep(1)}
        onSkip={onFinishOnboarding}
      />
    );
  }

  const slides = [
    {
      id: 1,
      title: tr.slide1Title,
      subtitle: tr.slide1Sub,
      detail: tr.slide1Detail,
      bg: "bg-[#FDF3CD]/65 dark:bg-[#38321F]/65",
      accentRing: "border-[#F2E09E]",
      visual: "butter" as const,
    },
    {
      id: 2,
      title: tr.slide2Title,
      subtitle: tr.slide2Sub,
      detail: tr.slide2Detail,
      bg: "bg-[#DCEEF8]/70 dark:bg-[#21303B]/70",
      accentRing: "border-[#C5E0F2]",
      visual: "planner" as const,
    },
    {
      id: 3,
      title: tr.slide3Title,
      subtitle: tr.slide3Sub,
      detail: tr.slide3Detail,
      bg: "bg-[#DCECE1]/70 dark:bg-[#24332A]/70",
      accentRing: "border-[#C9E0D0]",
      visual: "world" as const,
    },
  ];

  const slideIndex = step - 1;
  const current = slides[slideIndex];
  const isLast = slideIndex === slides.length - 1;

  return (
    <div className="min-h-[100dvh] w-full bg-[#FDFBF7] dark:bg-[#1D1B1E] flex flex-col items-center justify-between px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-12 relative overflow-hidden">
      <div className="butter-bubble w-32 h-32 -top-8 -end-8 absolute opacity-55 pointer-events-none" />
      <div className="butter-bubble w-20 h-20 bottom-20 -start-6 absolute opacity-45 pointer-events-none" />

      {/* Top skip row */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BetterLogoIcon className="w-8 h-8" />
          <span className="font-display font-bold text-lg tracking-tight text-[#2A2724] dark:text-[#F7F4EE]">
            BETTER
          </span>
        </div>
        {!isLast && (
          <button
            type="button"
            onClick={onFinishOnboarding}
            className="min-h-[44px] px-4 text-sm font-medium text-[#6C665F] dark:text-[#B6AFA6] hover:text-[#2A2724] dark:hover:text-white transition-colors"
          >
            {tr.skip}
          </button>
        )}
      </div>

      {/* Center Card */}
      <div className="w-full max-w-md my-auto py-6">
        <div
          className={`rounded-3xl p-8 sm:p-10 border ${current.bg} ${current.accentRing} dark:border-white/10 shadow-sm text-center transition-all duration-300`}
        >
          <div className="w-24 h-24 mx-auto rounded-3xl bg-white/85 dark:bg-black/20 border border-white/80 dark:border-white/10 flex items-center justify-center mb-7 shadow-sm">
            {current.visual === "butter" && <BetterLogoIcon className="w-16 h-16" />}
            {current.visual === "planner" && <PlannerIcon className="w-14 h-14" active />}
            {current.visual === "world" && (
              <div className="flex items-center gap-1">
                <SelfCareIcon className="w-11 h-11" />
                <MagicWandIcon className="w-10 h-10" />
              </div>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2A2724] dark:text-[#F7F4EE]">
            {current.title}
          </h1>
          <p className="mt-3 text-base sm:text-lg font-medium text-[#3F3B36] dark:text-[#E5E0D8]">
            {current.subtitle}
          </p>
          <p className="mt-3 text-sm text-[#6C665F] dark:text-[#B6AFA6] leading-relaxed">
            {current.detail}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2.5 mt-7" role="tablist" aria-label="Onboarding steps">
          {[0, 1, 2, 3].map((dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setStep(dotIdx)}
              aria-label={`Step ${dotIdx + 1}`}
              className="min-h-[44px] min-w-[28px] flex items-center justify-center"
            >
              <span
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  dotIdx === step
                    ? "w-7 bg-[#2A2724] dark:bg-[#FDF1C7]"
                    : "w-2.5 bg-[#D8D2C8] dark:bg-[#49454C]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-md flex items-center gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="min-h-[48px] px-5 rounded-2xl bg-[#F3EFE7] dark:bg-[#2C2A30] text-[#2A2724] dark:text-[#F7F4EE] font-medium text-sm hover:opacity-90 transition-opacity"
        >
          {tr.back}
        </button>
        <button
          type="button"
          onClick={() => {
            if (isLast) {
              onFinishOnboarding();
            } else {
              setStep((s) => s + 1);
            }
          }}
          className="flex-1 min-h-[48px] px-6 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] font-semibold text-base shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
        >
          {isLast ? tr.getStarted : tr.continueBtn}
        </button>
      </div>
    </div>
  );
};
