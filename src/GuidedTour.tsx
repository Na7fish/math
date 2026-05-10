import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, Play, Info, Map, Compass } from 'lucide-react';
import { cn } from './lib/utils';

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
  /** Called whenever a step needs to switch the active sim */
  onNavigate?: (sim: string) => void;
}

const PADDING = 12; // spotlight padding around element

export const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  onFinish,
  onSkip,
  onNavigate,
}) => {
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
      // Wait a tick for scroll then measure
      timerRef.current = setTimeout(() => {
        const rect = (document.querySelector(selector) as Element)?.getBoundingClientRect();
        if (rect) {
          setTargetRect(rect);
          setIsVisible(true);
        }
      }, 400);
    } else {
      // Retry — element may not be mounted yet (e.g. after nav)
      timerRef.current = setTimeout(locateTarget, 500);
    }
  };

  useLayoutEffect(() => {
    setIsVisible(false);
    setTargetRect(null);
    clearTimer();

    const step = steps[currentStep];
    // Navigate to the right sim first if requested
    if (step.navigate && onNavigate) {
      onNavigate(step.navigate);
      // Give React time to render the new sim
      timerRef.current = setTimeout(locateTarget, 600);
    } else {
      timerRef.current = setTimeout(locateTarget, 100);
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

  // ── Spotlight clip-path ──────────────────────────────────────────────────
  const buildClipPath = (r: DOMRect) => {
    const top = Math.max(0, r.top - PADDING);
    const left = Math.max(0, r.left - PADDING);
    const bottom = Math.min(window.innerHeight, r.bottom + PADDING);
    const right = Math.min(window.innerWidth, r.right + PADDING);
    return `polygon(
      0% 0%, 0% 100%,
      ${left}px 100%, ${left}px ${top}px,
      ${right}px ${top}px, ${right}px ${bottom}px,
      ${left}px ${bottom}px, ${left}px 100%,
      100% 100%, 100% 0%
    )`;
  };

  // ── Tooltip position ─────────────────────────────────────────────────────
  const getTooltipStyle = (r: DOMRect): React.CSSProperties => {
    const TW = 360; // tooltip width
    const TH = 260; // estimated tooltip height
    const margin = 16;

    let top: number | 'auto' = 'auto';
    let bottom: number | 'auto' = 'auto';
    const rawLeft = r.left + r.width / 2 - TW / 2;
    const left = Math.max(margin, Math.min(window.innerWidth - TW - margin, rawLeft));

    // Prefer below, fall back to above
    if (r.bottom + margin + TH < window.innerHeight) {
      top = r.bottom + margin;
    } else {
      bottom = window.innerHeight - r.top + margin;
    }

    return { top: top === 'auto' ? undefined : top, bottom: bottom === 'auto' ? undefined : bottom, left };
  };

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
            background: 'rgba(0,0,0,0.62)',
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
            top: targetRect.top - PADDING,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
            boxShadow: '0 0 0 3px #E8001D, 0 0 32px 6px rgba(232,0,29,0.25)',
          }}
        />
      )}

      {/* ── Tooltip ── */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className={cn(
              'absolute pointer-events-auto z-[10000] bg-white rounded-[24px] shadow-2xl overflow-hidden',
              'w-[340px] sm:w-[380px]'
            )}
            style={
              !targetRect
                ? { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }
                : getTooltipStyle(targetRect)
            }
          >
            {/* Progress bar */}
            <div className="h-1 bg-gray-100 w-full">
              <motion.div
                className="h-full bg-red-600"
                initial={{ width: `${((currentStep) / steps.length) * 100}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Header row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                    {currentStep === 0 ? <Compass className="w-5 h-5" /> : <Info className="w-4 h-4" />}
                  </div>
                  {/* Step dots */}
                  <div className="flex gap-1">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'rounded-full transition-all duration-300',
                          i === currentStep
                            ? 'w-4 h-2 bg-red-600'
                            : i < currentStep
                            ? 'w-2 h-2 bg-red-200'
                            : 'w-2 h-2 bg-gray-200'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={onSkip}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step label */}
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                ধাপ {currentStep + 1} / {steps.length}
              </span>

              {/* Title */}
              <h3 className="text-lg font-black text-gray-900 mt-1 mb-2 tracking-tight leading-snug">
                {step.emoji && <span className="mr-2">{step.emoji}</span>}
                {step.title}
              </h3>

              {/* Content */}
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {step.content}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={onSkip}
                  className="text-gray-400 text-xs font-bold hover:text-red-500 transition-colors uppercase tracking-wider"
                >
                  ট্যুর বাদ দিন
                </button>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={goPrev}
                      className="p-2.5 rounded-xl border-2 border-gray-100 text-gray-500 hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={goNext}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  >
                    {currentStep === steps.length - 1 ? 'শেষ করুন' : 'পরবর্তী'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
