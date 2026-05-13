import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquarePlus, X, Loader2 } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import { tr } from '../lib/translations';

interface FeedbackButtonProps {
  /** Short slug passed to Tally as simulation_name, e.g. "10ms-trig" */
  simulationName: string;
}

const TALLY_BASE = 'https://tally.so/r/RG87VJ';

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ simulationName }) => {
  const language = useLang();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const formUrl = `${TALLY_BASE}?simulation_name=${encodeURIComponent(simulationName)}`;

  const handleOpen = () => {
    setLoaded(false);
    setOpen(true);
  };

  return (
    <>
      {/* ── Floating CTA Button ── */}
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        /* Fixed bottom-right, above footer (z-40) */
        className="
          fixed bottom-20 right-4
          z-40
          flex items-center gap-2
          bg-white border border-gray-200
          text-gray-600 font-bold
          rounded-full
          shadow-lg shadow-black/10
          hover:border-red-200 hover:text-red-600 hover:shadow-red-100/50
          transition-colors duration-200
          /* mobile: icon only — just a circle */
          p-3 sm:px-4 sm:py-2.5
          text-xs
        "
        aria-label={tr('feedbackBtn', language)}
      >
        <MessageSquarePlus className="w-4 h-4 shrink-0" />
        {/* Text hidden on mobile */}
        <span className="hidden sm:inline whitespace-nowrap">{tr('feedbackBtn', language)}</span>
      </motion.button>

      {/* ── Feedback Modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="feedback-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center font-bangla"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              key="feedback-modal"
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="
                bg-white
                w-full sm:max-w-lg
                rounded-t-[24px] sm:rounded-[24px]
                shadow-2xl overflow-hidden
                flex flex-col
                /* height: full-ish on mobile, fixed on desktop */
                h-[88dvh] sm:h-[640px]
              "
            >
              {/* ── Modal header ── */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                    <MessageSquarePlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900 text-sm leading-none">{tr('feedbackBtn', language)}</h2>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">
                      {simulationName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={language === 'EN' ? 'Close' : 'বন্ধ করুন'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Iframe area ── */}
              <div className="relative flex-1 overflow-hidden">
                {/* Loading spinner */}
                {!loaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50">
                    <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
                    <p className="text-xs text-gray-400 font-medium">{tr('feedbackLoading', language)}</p>
                  </div>
                )}

                <iframe
                  src={formUrl}
                  title="Feedback Form"
                  className="w-full h-full border-none"
                  onLoad={() => setLoaded(true)}
                  allow="clipboard-write"
                />
              </div>

              {/* ── Subtle footer ── */}
              <div className="py-2 text-center border-t border-gray-50 shrink-0">
                <p className="text-[9px] text-gray-300 uppercase tracking-widest font-bold">
                  Powered by Tally · 10MS Math Lab
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
