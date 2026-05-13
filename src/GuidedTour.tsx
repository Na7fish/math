import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, Info, Compass } from 'lucide-react';
import { cn } from './lib/utils';
import { useLang } from './lib/LanguageContext';
import { tr } from './lib/translations';

export interface TourStep {
  /** CSS selector or 'center' for a centred modal */
  target: string;
  title: string;
  content: string;
  emoji?: string;
  /** Optional sim to navigate to before showing this step */
  navigate?: string;
}

interface GuidedTourProps {
  steps: TourStep[];
  onFinish: () => void;
  onSkip: () => void;
  onNavigate?: (sim: string) => void;
}

const PADDING = 10;

function isMobile() {
  return window.innerWidth < 640;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  onFinish,
  onSkip,
  onNavigate,
}) => {
  const language = useLang();
  const [currentStep, setCurrentStep] = useState(0);

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const locateTarget = () => {
    const selector = steps[currentStep].target;
    if (selector === 'center') {
      setTargetRect(null);
      setIsVisible(true);
      return;
    }
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      timerRef.current = setTimeout(() => {
        const rect = (document.querySelector(selector) as Element)?.getBoundingClientRect();
        if (rect) {
          setTargetRect(rect);
          setIsVisible(true);
        }
      }, 420);
    } else {
      timerRef.current = setTimeout(locateTarget, 500);
    }
  };

  useLayoutEffect(() => {
    setIsVisible(false);
    setTargetRect(null);
    clearTimer();

    const step = steps[currentStep];
    if (step.navigate && onNavigate) {
      onNavigate(step.navigate);
      timerRef.current = setTimeout(locateTarget, 650);
    } else {
      timerRef.current = setTimeout(locateTarget, 120);
    }

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    const handler = () => locateTarget();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else onFinish();
  };

  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const mobile = isMobile();

  // ── Spotlight clip-path ──────────────────────────────────────────────────
  const buildClipPath = (r: DOMRect) => {
    const top    = Math.max(0, r.top    - PADDING);
    const left   = Math.max(0, r.left   - PADDING);
    const bottom = Math.min(window.innerHeight, r.bottom + PADDING);
    const right  = Math.min(window.innerWidth,  r.right  + PADDING);
    return `polygon(
      0% 0%, 0% 100%,
      ${left}px 100%, ${left}px ${top}px,
      ${right}px ${top}px, ${right}px ${bottom}px,
      ${left}px ${bottom}px, ${left}px 100%,
      100% 100%, 100% 0%
    )`;
  };

  // ── Desktop tooltip position ──────────────────────────────────────────────
  const getDesktopStyle = (r: DOMRect): React.CSSProperties => {
    const TW     = 380;
    const TH     = 270;
    const margin = 16;

    const rawLeft = r.left + r.width / 2 - TW / 2;
    const left    = Math.max(margin, Math.min(window.innerWidth - TW - margin, rawLeft));

    // Prefer below; fall back above
    if (r.bottom + margin + TH < window.innerHeight) {
      return { top: r.bottom + margin, left };
    }
    return { bottom: window.innerHeight - r.top + margin, left };
  };

  // ── Tooltip inner card ────────────────────────────────────────────────────
  const Card = () => (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, y: 18, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', damping: 24, stiffness: 320 }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
    >
      {/* Progress bar */}
      <div className="h-1 bg-gray-100 w-full">
        <motion.div
          className="h-full bg-red-600"
          initial={{ width: `${(currentStep / steps.length) * 100}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0">
              {currentStep === 0 ? <Compass className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            </div>

            {/* Step progress dots — collapse into counter on mobile */}
            <div className="hidden sm:flex gap-1 flex-wrap max-w-[180px]">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === currentStep  ? 'w-4 h-2 bg-red-600'
                    : i < currentStep  ? 'w-2 h-2 bg-red-200'
                    :                    'w-2 h-2 bg-gray-200'
                  )}
                />
              ))}
            </div>

            {/* Mobile: compact counter badge */}
            <span className="sm:hidden text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">
              {currentStep + 1}/{steps.length}
            </span>
          </div>

          <button
            onClick={onSkip}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step label — desktop only */}
        <span className="hidden sm:block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {tr('tourStepLabel', language)} {currentStep + 1} / {steps.length}
        </span>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-black text-gray-900 mt-1 mb-2 tracking-tight leading-snug">
          {step.emoji && <span className="mr-1.5">{step.emoji}</span>}
          {step.title}
        </h3>

        {/* Content */}
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-5">
          {step.content}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onSkip}
            className="text-gray-400 text-[11px] font-bold hover:text-red-500 transition-colors uppercase tracking-wider whitespace-nowrap"
          >
            {tr('tourSkip', language)}
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={goPrev}
                className="p-2 rounded-xl border-2 border-gray-100 text-gray-500 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={goNext}
              className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
              {currentStep === steps.length - 1 ? tr('tourFinish', language) : tr('tourNext', language)}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none font-bangla">
      {/* ── Dark overlay with spotlight cut-out ── */}
      <AnimatePresence>
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-auto"
          style={{
            background: 'rgba(0,0,0,0.60)',
            clipPath: targetRect ? buildClipPath(targetRect) : undefined,
          }}
          onClick={onSkip}
        />
      </AnimatePresence>

      {/* ── Spotlight border glow ── */}
      {isVisible && targetRect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute pointer-events-none rounded-2xl"
          style={{
            top:    targetRect.top    - PADDING,
            left:   targetRect.left   - PADDING,
            width:  targetRect.width  + PADDING * 2,
            height: targetRect.height + PADDING * 2,
            boxShadow: '0 0 0 3px #E8001D, 0 0 28px 6px rgba(232,0,29,0.22)',
          }}
        />
      )}

      {/* ── Tooltip ── */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <>
            {/* 
              MOBILE  (< 640px): always show as a bottom-sheet fixed to the 
              bottom of the viewport — avoids off-screen positioning maths.

              DESKTOP (≥ 640px): smart positioning relative to the target.
            */}

            {/* Mobile bottom-sheet */}
            <motion.div
              key={`mobile-${currentStep}`}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="sm:hidden fixed bottom-0 left-0 right-0 z-[10000] px-3 pb-4"
            >
              <Card />
            </motion.div>

            {/* Desktop floating tooltip */}
            <motion.div
              key={`desktop-${currentStep}`}
              initial={{ opacity: 0, scale: 0.92, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="hidden sm:block absolute z-[10000] w-[380px]"
              style={
                !targetRect
                  ? { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }
                  : getDesktopStyle(targetRect)
              }
            >
              <Card />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
