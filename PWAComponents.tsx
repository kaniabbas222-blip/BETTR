import React, { useState } from "react";
import { Check, Download, Share, Smartphone, WifiOff, X } from "lucide-react";
import { t } from "../i18n/translations";
import { useOnlineStatus, usePWAInstall } from "../hooks/usePWA";
import type { AppLanguage } from "../types/butter";

interface OfflineIndicatorProps {
  language: AppLanguage;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const isOnline = useOnlineStatus();
  const tr = t(language);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-[#FDF1C7] dark:bg-[#38321F] border-b border-[#E7D8A3] dark:border-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-[#3D351E] dark:text-[#FCEEB5]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span>{tr.offlineBanner}</span>
      </div>
    </div>
  );
};

interface PWAInstallCardProps {
  language: AppLanguage;
}

export const PWAInstallCard: React.FC<PWAInstallCardProps> = ({ language }) => {
  const tr = t(language);
  const { isInstalled, canPromptNative, showIOSGuideOption, promptInstall } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) {
    return (
      <div className="rounded-3xl bg-[#E3F1E7] dark:bg-[#223228] border border-[#CFE4D5] dark:border-white/10 p-4 sm:p-5 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-[#1A261F] flex items-center justify-center shrink-0 text-[#4A7C59] dark:text-[#9BC8AA]">
          <Check className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm sm:text-base font-bold text-[#2A2724] dark:text-[#F7F4EE]">
            {tr.installedAppBadge}
          </p>
          <p className="text-xs text-[#566B5C] dark:text-[#B5D3BE]">{tr.installAppSub}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF7] via-[#FDF6DC] to-[#EEF5FB] dark:from-[#27252A] dark:via-[#2C2925] dark:to-[#222B33] border border-[#EAE4D8] dark:border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF1C7] dark:bg-[#3A3422] border border-[#E6D6A2] dark:border-white/10 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src="/icon.svg"
              alt="BETTER"
              className="w-9 h-9 rounded-xl"
            />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[#2A2724] dark:text-[#F7F4EE]">
              {tr.installAppTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#6C665F] dark:text-[#B6AFA6] mt-0.5">
              {tr.installAppSub}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (canPromptNative) {
              void promptInstall();
            } else {
              setShowIOSModal(true);
            }
          }}
          className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold inline-flex items-center justify-center gap-2 shrink-0 shadow-xs hover:opacity-95 transition-opacity"
        >
          {showIOSGuideOption ? <Share className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          <span>{showIOSGuideOption ? tr.installOnIOSBtn : tr.installAppBtn}</span>
        </button>
      </div>

      {showIOSModal && (
        <IOSInstallGuideModal
          language={language}
          onClose={() => setShowIOSModal(false)}
        />
      )}
    </>
  );
};

interface PWAInstallBannerProps {
  language: AppLanguage;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ language }) => {
  const tr = t(language);
  const { isInstalled, canPromptNative, showIOSGuideOption, canInstallOrGuide, promptInstall } =
    usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("better_pwa_banner_dismissed") === "1";
    } catch {
      return false;
    }
  });
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled || dismissed || !canInstallOrGuide) {
    return showIOSModal ? (
      <IOSInstallGuideModal language={language} onClose={() => setShowIOSModal(false)} />
    ) : null;
  }

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem("better_pwa_banner_dismissed", "1");
    } catch {
      // ignore storage quota errors
    }
  };

  return (
    <>
      <div className="rounded-3xl butter-glass border border-[#E5DEC9] dark:border-white/10 px-4 py-3 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/icon.svg" alt="BETTER" className="w-10 h-10 rounded-xl shrink-0" />
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-[#2A2724] dark:text-[#F7F4EE] truncate">
              {tr.installAppTitle}
            </p>
            <p className="text-xs text-[#6C665F] dark:text-[#B6AFA6] line-clamp-1">
              {tr.installAppSub}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (canPromptNative) {
                void promptInstall();
              } else {
                setShowIOSModal(true);
              }
            }}
            className="min-h-[44px] px-3.5 rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            {showIOSGuideOption ? <Share className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{showIOSGuideOption ? tr.installOnIOSBtn : tr.installAppBtn}</span>
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label={tr.closeLabel}
            className="min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center text-[#6C665F] dark:text-[#B6AFA6] hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSModal && (
        <IOSInstallGuideModal language={language} onClose={() => setShowIOSModal(false)} />
      )}
    </>
  );
};

const IOSInstallGuideModal: React.FC<{ language: AppLanguage; onClose: () => void }> = ({
  language,
  onClose,
}) => {
  const tr = t(language);
  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-install-title"
    >
      <div className="w-full sm:max-w-md bg-[#FDFBF7] dark:bg-[#232126] rounded-t-3xl sm:rounded-3xl border border-[#EAE4D8] dark:border-white/10 shadow-xl overflow-hidden pb-sheet-safe sm:pb-0">
        <div className="w-10 h-1.5 rounded-full bg-[#DAD4C8] dark:bg-[#4B4750] mx-auto mt-3 sm:hidden" />

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#EFEAE0] dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="BETTER" className="w-8 h-8 rounded-xl" />
            <h2
              id="ios-install-title"
              className="font-display text-base sm:text-lg font-bold text-[#2A2724] dark:text-[#F7F4EE]"
            >
              {tr.iosInstallTitle}
            </h2>
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

        <div className="p-5 space-y-3.5">
          <div className="rounded-2xl bg-[#EEF5FB] dark:bg-[#222B33] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1B191E] flex items-center justify-center shrink-0 text-[#4F789E] dark:text-[#A9D1EC]">
              <Share className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#2A2724] dark:text-[#F7F4EE]">
              {tr.iosInstallStep1}
            </p>
          </div>

          <div className="rounded-2xl bg-[#FDF3CD] dark:bg-[#38321F] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1B191E] flex items-center justify-center shrink-0 text-[#4A7C59] dark:text-[#9BC8AA]">
              <Smartphone className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#2A2724] dark:text-[#F7F4EE]">
              {tr.iosInstallStep2}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] rounded-2xl bg-[#2A2724] dark:bg-[#FDF1C7] text-[#FDFBF7] dark:text-[#2A2724] text-sm font-semibold"
          >
            {tr.gotItBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
