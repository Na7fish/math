import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Activity, Shapes, MapPin, Sparkles } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import { tr } from '../lib/translations';

interface WelcomeModalProps {
  onStartTour: () => void;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStartTour, onClose }) => {
  const language = useLang();
  const labs = [
    { icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'blue', title: tr('welcomeTrigLab', language),  desc: tr('welcomeTrigDesc', language) },
    { icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'red',  title: tr('welcomeAlgebraLab', language),     desc: tr('welcomeAlgebraDesc', language)           },
    { icon: <Shapes className="w-4 h-4 sm:w-5 sm:h-5" />,  color: 'purple', title: tr('welcomeGeometryLab', language),    desc: tr('welcomeGeometryDesc', language)          },
  ];

  const colorMap: Record<string, string> = {
    blue:   'bg-blue-100   text-blue-600',
    red:    'bg-red-100    text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center font-bangla"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          onClick={e => e.stopPropagation()}
          className="
            bg-white w-full max-w-md
            rounded-t-[28px] sm:rounded-[28px]
            shadow-2xl overflow-hidden
            max-h-[92dvh] sm:max-h-[90vh]
            flex flex-col
          "
        >
          {/* ── Hero strip ── */}
          <div className="relative bg-gradient-to-br from-red-600 to-red-700 px-6 sm:px-8 pt-8 sm:pt-10 pb-16 sm:pb-20 overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-48 sm:w-56 h-48 sm:h-56 bg-white/10 rounded-full -mr-24 sm:-mr-28 -mt-24 sm:-mt-28" />
            <div className="absolute bottom-0 left-0 w-36 sm:w-40 h-36 sm:h-40 bg-red-500/30 rounded-full -ml-18 sm:-ml-20 -mb-18 sm:-mb-20" />
            <div className="absolute top-10 right-10 w-12 sm:w-16 h-12 sm:h-16 bg-white/10 rounded-2xl rotate-12" />

            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.08, damping: 14 }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur rounded-xl sm:rounded-2xl flex items-center justify-center mb-4"
              >
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>

              <motion.h2
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.12 }}
                className="text-2xl sm:text-3xl font-black text-white mb-1.5 tracking-tight"
              >
                {tr('welcomeTitle', language)}
              </motion.h2>

              <motion.p
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.18 }}
                className="text-red-100 text-xs sm:text-sm leading-relaxed"
              >
                {tr('welcomeSubtitle', language)}
              </motion.p>
            </div>
          </div>

          {/* ── Body (overlapping card) ── */}
          <div className="-mt-8 bg-white rounded-[24px] sm:rounded-[28px] px-5 sm:px-7 pt-6 sm:pt-7 pb-6 sm:pb-7 relative z-10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] overflow-y-auto">
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
              {tr('welcomeBody', language)}
            </p>

            <div className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
              {labs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -14, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.22 + i * 0.07 }}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[item.color]}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-xs sm:text-sm">{item.title}</p>
                    <p className="text-gray-400 text-[11px] sm:text-xs">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2.5 sm:gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 sm:py-3 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold text-xs sm:text-sm hover:border-gray-200 hover:bg-gray-50 transition-all"
              >
                {tr('welcomeDirectStart', language)}
              </button>
              <button
                onClick={onStartTour}
                className="flex-1 py-2.5 sm:py-3 bg-red-600 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200/60"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {tr('welcomeTakeTour', language)}
              </button>
            </div>

            <p className="text-center text-[9px] sm:text-[10px] text-gray-300 mt-3 sm:mt-4 font-bold uppercase tracking-widest">
              {tr('gradeLabel', language)}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
