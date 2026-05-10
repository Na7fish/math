import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Circle, Square, Triangle, ChevronRight, Zap, Target, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

interface WelcomeGuideProps {
  onClose: () => void;
  onStart: (sim?: string) => void;
}

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ onClose, onStart }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 font-bangla">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Header Banner */}
          <div className="bg-red-600 p-8 text-white text-center relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-400/20 rounded-full -mr-16 -mb-16 blur-2xl" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors group"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-white" />
            </button>

            <motion.h2 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-black mb-2 tracking-tight"
            >
              ১০এমএস ম্যাথ ল্যাবে স্বাগতম!
            </motion.h2>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-red-100 text-lg font-medium opacity-90"
            >
              গণিতের রহস্য উন্মোচন করো — নিজে পরীক্ষা করে শেখো
            </motion.p>
          </div>

          <div className="p-8 sm:p-10">
            {/* Feature Sections */}
            <div className="mb-10">
              <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                কি কি করা যাবে?
                <div className="h-px flex-1 bg-gray-100" />
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureCard 
                  icon={<Target className="w-5 h-5" />}
                  title="ত্রিকোণমিতি এক্সপ্লোরেশন"
                  desc="ইউনিট সার্কেল এবং সাইন-কোসাইন গ্রাফ সরাসরি পরিবর্তন করে শিখুন।"
                  color="blue"
                  onClick={() => onStart('Trigonometry')}
                />
                <FeatureCard 
                  icon={<Zap className="w-5 h-5" />}
                  title="দ্বিঘাত সমীকরণ ল্যাব"
                  desc="প্যারাবোলা এবং এর সহগগুলোর প্রভাব রিয়েল-টাইমে পর্যবেক্ষণ করুন।"
                  color="red"
                  onClick={() => onStart('Quadratics')}
                />
                <FeatureCard 
                  icon={<BookOpen className="w-5 h-5" />}
                  title="জ্যামিতি ল্যাব"
                  desc="বৃত্তের গুরুত্বপূর্ণ উপপাদ্যগুলো অ্যানিমেশনের মাধ্যমে ধাপে ধাপে শিখুন।"
                  color="purple"
                  onClick={() => onStart('Geometry')}
                />
                <FeatureCard 
                  icon={<Play className="w-5 h-5 fill-current" />}
                  title="ইন্টারেক্টিভ লার্নিং"
                  desc="সরাসরি ইনপুট দিয়ে এবং টেনে কোণ পরিবর্তন করে গণিতের মজা নিন।"
                  color="green"
                  onClick={() => onStart()}
                />
              </div>
            </div>

            {/* CTA Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStart()}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-red-200 transition-all group"
            >
              সরাসরি সিমুলেশন শুরু করি
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

function FeatureCard({ icon, title, desc, color, onClick }: { icon: React.ReactNode, title: string, desc: string, color: string, onClick: () => void }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600"
  };

  return (
    <div 
      onClick={onClick}
      className="group p-4 bg-gray-50/50 hover:bg-white rounded-2xl border border-transparent hover:border-gray-200 transition-all cursor-pointer flex items-start gap-4"
    >
      <div className={cn("w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", colors[color])}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1 text-sm">{title}</h4>
        <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
