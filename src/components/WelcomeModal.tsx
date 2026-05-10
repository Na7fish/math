import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Activity, Shapes, ChevronRight, Sparkles, MapPin } from 'lucide-react';

interface WelcomeModalProps {
  onStartTour: () => void;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStartTour, onClose }) => {
  const labs = [
    {
      icon: <Target className="w-5 h-5" />,
      color: 'blue',
      title: 'ত্রিকোণমিতি ল্যাব',
      desc: 'ইউনিট সার্কেল ও ত্রিকোণমিতিক অনুপাত',
    },
    {
      icon: <Activity className="w-5 h-5" />,
      color: 'red',
      title: 'বীজগণিত ল্যাব',
      desc: 'দ্বিঘাত সমীকরণ ও প্যারাবোলা',
    },
    {
      icon: <Shapes className="w-5 h-5" />,
      color: 'purple',
      title: 'জ্যামিতি ল্যাব',
      desc: 'বৃত্তের উপপাদ্য ও অ্যানিমেশন',
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center p-4 font-bangla"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Gradient Hero */}
          <div className="relative bg-gradient-to-br from-red-600 via-red-600 to-red-700 px-8 pt-10 pb-20 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -mr-28 -mt-28" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-500/30 rounded-full -ml-20 -mb-20" />
            <div className="absolute top-12 right-12 w-16 h-16 bg-white/10 rounded-2xl rotate-12" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.1, damping: 15 }}
                className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-5"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-3xl font-black text-white mb-2 tracking-tight"
              >
                স্বাগতম! 🎉
              </motion.h2>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-red-100 text-sm leading-relaxed"
              >
                ১০এমএস ম্যাথ ল্যাবে আপনাকে আন্তরিকভাবে স্বাগত জানাই।
              </motion.p>
            </div>
          </div>

          {/* Body — overlaps the hero with a card lift */}
          <div className="-mt-10 bg-white rounded-[28px] px-7 pt-7 pb-7 relative z-10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              এখানে তিনটি ইন্টারেক্টিভ ম্যাথ ল্যাব রয়েছে। প্রতিটিতে রয়েছে রিয়েল-টাইম সিমুলেশন যা তোমার শেখাকে সহজ ও মজাদার করবে।
            </p>

            <div className="space-y-2.5 mb-6">
              {labs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[item.color]}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                    <p className="text-gray-400 text-xs">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold text-sm hover:border-gray-200 hover:bg-gray-50 transition-all"
              >
                সরাসরি শুরু করি
              </button>
              <button
                onClick={onStartTour}
                className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200/60"
              >
                <MapPin className="w-4 h-4" />
                ট্যুর নিন
              </button>
            </div>

            <p className="text-center text-[10px] text-gray-300 mt-4 font-bold uppercase tracking-widest">
              নবম–দশম শ্রেণি · গণিত
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
