/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Activity,
  Target,
  ChevronRight,
  Shapes,
  Play,
  BookOpen,
  Info
} from 'lucide-react';
import MathText from './components/MathText';
import { cn, getSpecialLabel, toBengaliNumber, SPECIAL_ANGLES } from './lib/utils';
import QuadraticSim from './QuadraticSim';
import GeometrySim from './GeometrySim';
import { GuidedTour } from './GuidedTour';
import { WelcomeModal } from './components/WelcomeModal';
import { FeedbackButton } from './components/FeedbackButton';
import { LanguageContext } from './lib/LanguageContext';
import { tr } from './lib/translations';


// --- Utils ---
const parseMath = (input: string): number | null => {
  try {
    // Advanced sanitization and conversion for ratios and square roots
    let clean = input.toLowerCase()
      .replace(/\\/g, '')             // Remove backslashes (e.g., \sqrt -> sqrt)
      .replace(/\{/g, '(')            // Convert all curly braces to parentheses
      .replace(/\}/g, ')')
      .replace(/√\s*(\d+(\.\d+)?)/g, 'Math.sqrt($1)') // Handle √3 or √ 3
      .replace(/√/g, 'Math.sqrt')     // Handle remaining √ as Math.sqrt
      .replace(/sqrt/g, 'Math.sqrt')  // Ensure sqrt is Math.sqrt
      .replace(/pi/g, 'Math.PI');

    // Clean up spaces and evaluate
    const result = new Function(`return ${clean.replace(/\s+/g, '')}`)();
    return typeof result === 'number' && !isNaN(result) ? result : null;
  } catch (e) {
    return null;
  }
};

// --- Types ---
type ActiveSim = 'Trigonometry' | 'Quadratics' | 'Geometry' | 'Home';

interface SimState {
  angle: number; // in degrees
  unit: 'deg' | 'rad';
  showTriangle: boolean;
  showSymmetry: boolean;
  showArc: boolean;
  isAutoRotating: boolean;
  rotationSpeed: number;
  isBlinkingArc: boolean;
  isBlinkingLines: boolean;
}



// --- Components ---

export default function App() {
  const [language, setLanguage] = useState<'BN' | 'EN'>('BN');
  const tourSteps = React.useMemo(() => [
    { target: 'center', emoji: '👋', title: tr('tour1Title', language), content: tr('tour1Content', language) },
    { target: '#tour-feature-cards', emoji: '🗂️', title: tr('tour2Title', language), content: tr('tour2Content', language) },
    { target: '#tour-quickstart', emoji: '⚡', title: tr('tour3Title', language), content: tr('tour3Content', language) },
    { target: '#tour-trig-card', emoji: '📐', title: tr('tour4Title', language), content: tr('tour4Content', language) },
    { target: '#trig-angle-control', emoji: '🎯', title: tr('tour5Title', language), navigate: 'Trigonometry', content: tr('tour5Content', language) },
    { target: '#trig-canvas-area', emoji: '⭕', title: tr('tour6Title', language), navigate: 'Trigonometry', content: tr('tour6Content', language) },
    { target: '#trig-values-panel', emoji: '📊', title: tr('tour7Title', language), navigate: 'Trigonometry', content: tr('tour7Content', language) },
    { target: '#trig-wave-graph', emoji: '〰️', title: tr('tour8Title', language), navigate: 'Trigonometry', content: tr('tour8Content', language) },
    { target: '#trig-settings', emoji: '⚙️', title: tr('tour9Title', language), navigate: 'Trigonometry', content: tr('tour9Content', language) },
    { target: 'center', emoji: '📈', title: tr('tour10Title', language), navigate: 'Quadratics', content: tr('tour10Content', language) },
    { target: 'center', emoji: '📐', title: tr('tour11Title', language), navigate: 'Geometry', content: tr('tour11Content', language) },
    { target: 'center', emoji: '🎉', title: tr('tour12Title', language), navigate: 'Home', content: tr('tour12Content', language) }
  ], [language]);

  const [activeSim, setActiveSim] = useState<ActiveSim>('Home');
  const [showTour, setShowTour] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedTheorem, setSelectedTheorem] = useState<number | null>(null);

  // Show welcome modal on first ever visit
  useEffect(() => {
    const seen = localStorage.getItem('10ms-welcomed');
    if (!seen) {
      const t = setTimeout(() => setShowWelcome(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const [state, setState] = useState<SimState>({
    angle: 0,
    unit: 'deg',
    showTriangle: false,
    showSymmetry: false,
    showArc: true,
    isAutoRotating: false,
    rotationSpeed: 1,
    isBlinkingArc: true,
    isBlinkingLines: true,
  });

  // Initialize state from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sim = params.get('sim');
    const chapter = params.get('chapter');
    const theorem = params.get('theorem');
    const angle = params.get('angle');
    const unit = params.get('unit');
    const lang = params.get('lang');

    if (lang === 'EN') setLanguage('EN');
    else if (lang === 'BN') setLanguage('BN');

    if (sim === 'trig') {
      setActiveSim('Trigonometry');
      setState(prev => ({
        ...prev,
        angle: angle ? parseInt(angle) : 0,
        unit: (unit === 'rad' ? 'rad' : 'deg') as 'deg' | 'rad'
      }));
    }
    else if (sim === 'quad') setActiveSim('Quadratics');
    else if (sim === 'geom') {
      setActiveSim('Geometry');
      if (chapter) setSelectedChapter(parseInt(chapter));
      if (theorem) setSelectedTheorem(parseInt(theorem));
    }

    setTimeout(() => {
      // Do nothing, we show home page by default
    }, 800);
  }, []);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('lang', language);
    if (activeSim === 'Trigonometry') {
      params.set('sim', 'trig');
      params.set('angle', Math.round(state.angle).toString());
      params.set('unit', state.unit);
    }
    else if (activeSim === 'Quadratics') params.set('sim', 'quad');
    else if (activeSim === 'Geometry') {
      params.set('sim', 'geom');
      if (selectedChapter) params.set('chapter', selectedChapter.toString());
      if (selectedTheorem) params.set('theorem', selectedTheorem.toString());
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [activeSim, selectedChapter, selectedTheorem, state.angle, state.unit, language]);

  const rad = (state.angle * Math.PI) / 180;
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);
  const tanVal = Math.abs(Math.cos(rad)) < 0.001 ? Infinity : Math.tan(rad);

  const quadrant = Math.floor(((state.angle % 360) + 360) % 360 / 90) + 1;
  const specialLabels = getSpecialLabel(state.angle);

  const [angleInput, setAngleInput] = useState("");
  const [cosInput, setCosInput] = useState(cosVal.toFixed(3));
  const [sinInput, setSinInput] = useState(sinVal.toFixed(3));
  const [tanInput, setTanInput] = useState(tanVal === Infinity ? "∞" : tanVal.toFixed(3));

  const updateAngle = React.useCallback((newAngle: number) => {
    setState(prev => ({ ...prev, angle: newAngle }));
    setAngleInput(Math.round(newAngle).toString());
    const r = (newAngle * Math.PI) / 180;
    setCosInput(Math.cos(r).toFixed(3));
    setSinInput(Math.sin(r).toFixed(3));
    setTanInput(Math.abs(Math.cos(r)) < 0.001 ? "∞" : Math.tan(r).toFixed(3));
  }, []);

  useEffect(() => {
    if (!state.isAutoRotating) {
      const special = getSpecialLabel(state.angle);
      if (special) {
        setCosInput(special.cosRaw);
        setSinInput(special.sinRaw);
        setTanInput(special.tanRaw);
        setAngleInput(state.unit === 'deg' ? Math.round(state.angle).toString() : special.radRaw);
      } else {
        setCosInput(cosVal.toFixed(3));
        setSinInput(sinVal.toFixed(3));
        setTanInput(tanVal === Infinity ? "∞" : tanVal.toFixed(3));
        setAngleInput(state.unit === 'deg' ? Math.round(state.angle).toString() : (rad / Math.PI).toFixed(2) + 'π');
      }
    }
  }, [state.angle, state.unit, state.isAutoRotating]);

  const angleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeSim === 'Trigonometry') {
      setAngleInput(""); // Clear for placeholder visibility
      setTimeout(() => {
        angleInputRef.current?.focus();
      }, 100);
    }
  }, [activeSim]);

  useEffect(() => {
    if (state.isAutoRotating) {
      const interval = setInterval(() => {
        setState(prev => ({ ...prev, angle: (prev.angle + prev.rotationSpeed) % 360 }));
      }, 16);
      return () => clearInterval(interval);
    }
  }, [state.isAutoRotating, state.rotationSpeed]);

  if (activeSim === 'Home') {
    return (
      <LanguageContext.Provider value={language}>
        <div className="min-h-screen bg-gray-50 flex flex-col font-bangla text-ten-ink">
          <header className="min-h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm sticky top-0 z-50">
            <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
              <img 
                src="https://cdn.10minuteschool.com/images/svg/Origin%20Labs%20Black.svg" 
                alt="10MS Logo" 
                className="h-6 md:h-8 shrink-0" 
              />
              <h1 className="hidden sm:block text-lg md:text-2xl font-bold text-red-600 truncate mr-2 border-l border-gray-200 pl-2 md:pl-3">
                Math Laboratory
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setLanguage('BN')}
                  className={cn(
                    "px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition-all",
                    language === 'BN' ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  BN
                </button>
                <button
                  onClick={() => setLanguage('EN')}
                  className={cn(
                    "px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition-all",
                    language === 'EN' ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  EN
                </button>
              </div>
              <button
                onClick={() => setShowTour(true)}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-red-50 text-red-600 rounded-xl text-[10px] md:text-xs font-bold flex items-center gap-1.5 md:gap-2 hover:bg-red-600 hover:text-white transition-all border border-red-100 whitespace-nowrap"
              >
                <Play className="w-3 h-3 fill-current" /> <span className="hidden sm:inline">{tr('startTutorial', language)}</span><span className="sm:hidden">Tour</span>
              </button>
            </div>
          </header>
          <main className="flex-1 flex flex-col items-center overflow-y-auto">
            {/* Hero Banner */}
            <div className="w-full bg-red-600 p-8 md:p-16 text-white text-center relative overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-400/20 rounded-full -mr-32 -mb-32 blur-3xl" />

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl md:text-6xl font-black mb-4 tracking-tight"
              >
                {tr('heroTitle', language)}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-red-100 text-lg md:text-2xl font-medium opacity-90 max-w-2xl mx-auto px-4"
              >
                {tr('heroSubtitle', language)}
              </motion.p>
            </div>

            <div className="max-w-6xl w-full p-8 md:p-12">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                {tr('whatCanYouDo', language)}
                <div className="h-px flex-1 bg-gray-200" />
              </h3>

              <div id="tour-feature-cards" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <HomeFeatureCard
                  id="tour-trig-card"
                  icon={<Target className="w-8 h-8" />}
                  title={tr('trigCardTitle', language)}
                  desc={tr('trigCardDesc', language)}
                  color="blue"
                  onClick={() => {
                    setState(prev => ({ ...prev, angle: 0, unit: 'deg' }));
                    setActiveSim('Trigonometry');
                  }}
                />
                <HomeFeatureCard
                  id="tour-quad-card"
                  icon={<Activity className="w-8 h-8" />}
                  title={tr('quadCardTitle', language)}
                  desc={tr('quadCardDesc', language)}
                  color="red"
                  onClick={() => setActiveSim('Quadratics')}
                />
                <HomeFeatureCard
                  id="tour-geom-card"
                  icon={<Shapes className="w-8 h-8" />}
                  title={tr('geomCardTitle', language)}
                  desc={tr('geomCardDesc', language)}
                  color="purple"
                  onClick={() => setActiveSim('Geometry')}
                />
              </div>

              {/* Quick Actions / Presets Style */}
              <div id="tour-quickstart" className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <h4 className="text-gray-900 font-black text-xl mb-6">{tr('quickStartTitle', language)}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button onClick={() => { setActiveSim('Trigonometry'); setState(s => ({ ...s, angle: 30 })); }} className="p-4 border border-gray-100 rounded-2xl hover:border-red-200 hover:bg-red-50/30 transition-all text-left group whitespace-normal">
                    <span className="block font-bold text-gray-800 group-hover:text-red-600 transition-colors">{tr('qs1Title', language)}</span>
                    <span className="text-xs text-gray-400">{tr('qs1Desc', language)}</span>
                  </button>
                  <button onClick={() => setActiveSim('Quadratics')} className="p-4 border border-gray-100 rounded-2xl hover:border-red-200 hover:bg-red-50/30 transition-all text-left group whitespace-normal">
                    <span className="block font-bold text-gray-800 group-hover:text-red-600 transition-colors">{tr('qs2Title', language)}</span>
                    <span className="text-xs text-gray-400">{tr('qs2Desc', language)}</span>
                  </button>
                  <button onClick={() => { setActiveSim('Geometry'); setSelectedChapter(8); setSelectedTheorem(18); }} className="p-4 border border-gray-100 rounded-2xl hover:border-red-200 hover:bg-red-50/30 transition-all text-left group whitespace-normal">
                    <span className="block font-bold text-gray-800 group-hover:text-red-600 transition-colors">{tr('qs3Title', language)}</span>
                    <span className="text-xs text-gray-400">{tr('qs3Desc', language)}</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
          {showWelcome && (
            <WelcomeModal
              onStartTour={() => {
                localStorage.setItem('10ms-welcomed', '1');
                setShowWelcome(false);
                setShowTour(true);
              }}
              onClose={() => {
                localStorage.setItem('10ms-welcomed', '1');
                setShowWelcome(false);
              }}
            />
          )}
          {showTour && (
            <GuidedTour
              steps={tourSteps}
              onFinish={() => setShowTour(false)}
              onSkip={() => setShowTour(false)}
              onNavigate={(sim) => {
                if (sim === 'Trigonometry') { setState(prev => ({ ...prev, angle: 45 })); setActiveSim('Trigonometry'); }
                else if (sim === 'Quadratics') setActiveSim('Quadratics');
                else if (sim === 'Geometry') { setSelectedChapter(null); setSelectedTheorem(null); setActiveSim('Geometry'); }
                else if (sim === 'Home') setActiveSim('Home');
              }}
            />
          )}
          <FeedbackButton simulationName="10ms-home" />
        </div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={language}>
      <div className="min-h-screen bg-gray-50 flex flex-col font-bangla text-ten-ink select-none overflow-hidden">
        {/* Header */}
        <header className="min-h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 md:px-6 shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
            <button
              onClick={() => setActiveSim('Home')}
              className="p-1.5 md:p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors shrink-0"
            >
              <ChevronLeft width="18" height="18" className="text-gray-600 stroke-[2.5]" />
            </button>
            <h1 className="text-base md:text-xl font-bold truncate flex items-center gap-2 md:gap-3">
              <img 
                src="https://cdn.10minuteschool.com/images/svg/Origin%20Labs%20Black.svg" 
                alt="10MS Logo" 
                className="h-5 md:h-6 shrink-0" 
              />
              <span className="hidden md:block border-l border-gray-200 pl-2 md:pl-3">
                {activeSim === 'Trigonometry' ? tr('simTitleTrig', language) :
                  activeSim === 'Quadratics' ? tr('simTitleQuad', language) : tr('simTitleGeom', language)}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setLanguage('BN')}
                className={cn(
                  "px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition-all",
                  language === 'BN' ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                BN
              </button>
              <button
                onClick={() => setLanguage('EN')}
                className={cn(
                  "px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition-all",
                  language === 'EN' ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                EN
              </button>
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-500">
              {activeSim === 'Trigonometry' ? tr('chapterTrig', language) :
                activeSim === 'Quadratics' ? tr('chapterQuad', language) : ''}
            </span>
            <div className="hidden lg:block px-2 py-0.5 md:px-3 md:py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap">{tr('gradeLabel', language)}</div>
          </div>
        </header>

        {activeSim === 'Trigonometry' ? (
          <main className="flex-1 p-2 md:p-5 grid grid-cols-12 gap-3 md:gap-4 max-w-7xl mx-auto w-full auto-rows-min lg:auto-rows-fr overflow-y-auto">
            {/* Top Bento Row: Angle Control */}
            <div id="trig-angle-control" className="col-span-12 bento-card flex flex-col sm:flex-row items-center px-4 md:px-6 py-3 md:py-4 justify-between bg-white gap-4">
              <div className="flex items-center gap-4 md:gap-8 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex flex-col gap-1">
                  <span className="text-xs md:text-[10px] uppercase tracking-wider text-gray-500 font-bold">{tr('setAngleLabel', language)}</span>
                  <div className="flex items-center gap-2">
                    <input
                      ref={angleInputRef}
                      type="text"
                      value={angleInput}
                      onChange={(e) => {
                        setAngleInput(e.target.value);
                        const val = parseMath(e.target.value);
                        if (val !== null) {
                          if (state.unit === 'deg') updateAngle(val);
                          else updateAngle((val * 180) / Math.PI);
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                      className="text-base md:text-2xl font-bold w-28 md:w-32 border-none px-3 py-1.5 focus:ring-0 bg-gray-50 rounded-lg shadow-inner text-gray-700 transition-all focus:bg-white focus:shadow-md"
                      placeholder={tr('anglePlaceholder', language)}
                    />
                    <span className="text-lg md:text-2xl font-bold -ml-1 text-gray-400">{state.unit === 'deg' ? '°' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-gray-600">
                <span>{tr('dragPoint', language)}</span>
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                </div>
              </div>
            </div>

            {/* Left Grid: Simulation Canvas */}
            <div id="trig-canvas-area" className="col-span-12 lg:col-span-7 lg:row-span-5 flex flex-col gap-4">
              <div className="bento-card relative overflow-hidden flex items-center justify-center bg-white aspect-square lg:aspect-auto flex-1 min-h-[300px] md:min-h-[400px]">
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                  <span className={cn(
                    "text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm border-2",
                    quadrant === 1 ? "bg-gray-50 text-gray-800 border-gray-200" :
                      quadrant === 2 ? "bg-gray-50 text-gray-800 border-gray-200" :
                        quadrant === 3 ? "bg-gray-50 text-gray-800 border-gray-200" :
                          "bg-gray-50 text-gray-800 border-gray-200"
                  )}>
                    QUADRANT
                  </span>
                </div>

                <UnitCircleCanvas state={state} onAngleChange={updateAngle} />
              </div>
            </div>

            {/* Right Grid: Stats & Controls */}
            <div className="col-span-12 lg:col-span-5 lg:row-span-5 flex flex-col gap-4 overflow-y-auto">

              {/* Coordinates Bento Box */}
              <section id="trig-values-panel" className="bento-card p-5 flex flex-col justify-start">
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest pb-1">{tr('allValuesTitle', language)}</span>

                <div className="mt-6 space-y-4">
                  {/* Detailed Summary Info - Always Visible */}
                  <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-100">
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                      <span className="text-[10px] text-red-600 font-bold uppercase block mb-1">{tr('radianValue', language)}</span>
                      <span className="text-xl font-bold text-red-700 font-mono">
                        {specialLabels ? <MathText math={specialLabels.rad} /> : (rad).toFixed(2) + ' rad'}
                      </span>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                      <span className="text-[10px] text-red-600 font-bold uppercase block mb-1">{tr('coordinateLabel', language)}</span>
                      <span className="text-xl font-bold text-red-700 font-mono">
                        ({specialLabels ? <MathText math={specialLabels.cos} /> : cosVal.toFixed(3)}, {specialLabels ? <MathText math={specialLabels.sin} /> : sinVal.toFixed(3)})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-between min-h-[68px] border-b border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-info">cos θ <span className="text-xs opacity-60 font-normal ml-1">({tr('cosDesc', language)})</span></span>
                        <span className="text-[10px] text-info opacity-50 font-bold tracking-tighter">X = Cos(θ)</span>
                      </div>
                      <div className="text-right flex flex-col items-end justify-center">
                        <input
                          type="text"
                          value={cosInput}
                          onChange={(e) => {
                            setCosInput(e.target.value);
                            const val = parseMath(e.target.value);
                            if (val !== null && val >= -1.01 && val <= 1.01) {
                              const currentAngle = (state.angle % 360 + 360) % 360;
                              let newAngle = (Math.acos(Math.max(-1, Math.min(1, val))) * 180) / Math.PI;
                              if (currentAngle > 180) newAngle = 360 - newAngle;
                              updateAngle(newAngle);
                              setCosInput(e.target.value);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          className="text-2xl font-bold mono text-info w-32 text-right border-b-2 border-transparent focus:border-info bg-transparent outline-none p-0"
                          placeholder="cos θ"
                        />
                        <div className="h-4">
                          {specialLabels?.cos && <div className="text-[10px] text-info font-bold uppercase"><MathText math={specialLabels.cos} /></div>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between min-h-[68px] border-b border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-success">sin θ <span className="text-xs opacity-60 font-normal ml-1">({tr('sinDesc', language)})</span></span>
                        <span className="text-[10px] text-success opacity-50 font-bold tracking-tighter">Y = Sin(θ)</span>
                      </div>
                      <div className="text-right flex flex-col items-end justify-center">
                        <input
                          type="text"
                          value={sinInput}
                          onChange={(e) => {
                            setSinInput(e.target.value);
                            const val = parseMath(e.target.value);
                            if (val !== null && val >= -1.01 && val <= 1.01) {
                              const currentAngle = (state.angle % 360 + 360) % 360;
                              let newAngle = (Math.asin(Math.max(-1, Math.min(1, val))) * 180) / Math.PI;
                              const isInLeftHemisphere = currentAngle > 90 && currentAngle < 270;
                              if (isInLeftHemisphere) newAngle = 180 - newAngle;
                              if (newAngle < 0) newAngle += 360;
                              updateAngle(newAngle);
                              setSinInput(e.target.value);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          className="text-2xl font-bold mono text-success w-32 text-right border-b-2 border-transparent focus:border-success bg-transparent outline-none p-0"
                          placeholder="sin θ"
                        />
                        <div className="h-4">
                          {specialLabels?.sin && <div className="text-[10px] text-success font-bold uppercase"><MathText math={specialLabels.sin} /></div>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between min-h-[68px]">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-warn">tan θ <span className="text-xs opacity-60 font-normal ml-1">({tr('tanDesc', language)})</span></span>
                        <span className="text-xs text-warn font-bold tracking-tighter">
                          <MathText math="m = \frac{\sin(\theta)}{\cos(\theta)}" />
                        </span>
                      </div>
                      <div className="text-right flex flex-col items-end justify-center">
                        <input
                          type="text"
                          value={tanInput}
                          onChange={(e) => {
                            setTanInput(e.target.value);
                            const val = parseMath(e.target.value);
                            if (val !== null) {
                              const currentAngle = (state.angle % 360 + 360) % 360;
                              let newAngle = (Math.atan(val) * 180) / Math.PI;
                              const isLeft = currentAngle > 90 && currentAngle < 270;
                              if (isLeft) newAngle += 180;
                              if (newAngle < 0) newAngle += 360;
                              updateAngle(newAngle);
                              setTanInput(e.target.value);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          className={cn(
                            "font-bold mono text-warn text-right border-b-2 border-transparent focus:border-warn bg-transparent outline-none p-0",
                            tanInput.length > 8 ? "text-xl w-60" : "text-2xl w-32"
                          )}
                          placeholder="tan θ"
                        />
                        <div className="h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>


              {/* Settings / Toggles */}
              <section id="trig-settings" className="bento-card p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tr('settingsTitle', language)}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <SmallToggle
                    label={tr('blinkLines', language)}
                    active={state.isBlinkingLines}
                    onClick={() => setState(prev => ({ ...prev, isBlinkingLines: !prev.isBlinkingLines }))}
                  />
                  <SmallToggle
                    label={tr('blinkArc', language)}
                    active={state.isBlinkingArc}
                    onClick={() => setState(prev => ({ ...prev, isBlinkingArc: !prev.isBlinkingArc }))}
                  />
                </div>
              </section>

              {/* Wave Graph Section */}
              <section id="trig-wave-graph" className="bento-card p-5 flex flex-col gap-3 bg-white">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest">{tr('waveTitle', language)}</span>
                <div className="h-40 w-full">
                  <WaveGraph angle={state.angle} />
                </div>
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-[#1CAB55] rounded-full" />
                    <span className="text-[10px] font-bold text-gray-500">{tr('sinWave', language)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-[#274FE3] rounded-full" />
                    <span className="text-[10px] font-bold text-gray-500">{tr('cosWave', language)}</span>
                  </div>
                </div>
              </section>
            </div>
          </main>
        ) : activeSim === 'Quadratics' ? (
          <QuadraticSim />
        ) : (
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            <GeometrySim
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
              selectedTheorem={selectedTheorem}
              setSelectedTheorem={setSelectedTheorem}
            />
          </main>
        )}

        {/* ── Feedback CTA — shown on all sim pages ── */}
        {activeSim === 'Trigonometry' && <FeedbackButton simulationName="10ms-trig" />}
        {activeSim === 'Quadratics' && <FeedbackButton simulationName="10ms-quadratics" />}
        {activeSim === 'Geometry' && <FeedbackButton simulationName="10ms-geometry" />}

        {/* Footer */}
        <footer className="py-4 text-center text-[10px] text-gray-400 font-sans border-t bg-white uppercase tracking-widest shrink-0">
          {tr('footer', language)}
        </footer>

        {showTour && (
          <GuidedTour
            steps={tourSteps}
            onFinish={() => setShowTour(false)}
            onSkip={() => setShowTour(false)}
            onNavigate={(sim) => {
              if (sim === 'Trigonometry') { setState(prev => ({ ...prev, angle: 45 })); setActiveSim('Trigonometry'); }
              else if (sim === 'Quadratics') setActiveSim('Quadratics');
              else if (sim === 'Geometry') { setSelectedChapter(null); setSelectedTheorem(null); setActiveSim('Geometry'); }
              else if (sim === 'Home') setActiveSim('Home');
            }}
          />
        )}
      </div>
    </LanguageContext.Provider>
  );
}

function HomeFeatureCard({ id, icon, title, desc, color, onClick }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600"
  };

  return (
    <motion.div
      id={id}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group p-6 bg-white hover:bg-red-50/20 rounded-[32px] border border-gray-100 hover:border-red-100 transition-all cursor-pointer flex flex-col gap-4 shadow-sm hover:shadow-md"
    >
      <div className={cn("w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", colors[color])}>
        {icon}
      </div>
      <div>
        <h4 className="font-black text-gray-900 mb-1.5 text-lg tracking-tight">{title}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// --- Subcomponents ---

function SimChoiceCard({ id, title, desc, icon, subject = tr('highMath', language), onClick }: any) {
  return (
    <motion.button
      id={id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-red-500 transition-all text-left shadow-lg flex flex-col gap-4 group relative"
    >
      <div className="absolute top-4 right-4 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[9px] md:text-[10px] font-bold border border-gray-200">{tr('gradeLabel', language).split(':')[0]}: {subject}</div>
      <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-red-50 transition-colors w-fit">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 font-sans leading-relaxed">{desc}</p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-ten-red font-bold font-sans">
        {tr('startSim', language)} <ChevronRight className="w-4 h-4" />
      </div>
    </motion.button>
  );
}

function SignPill({ label, isPositive }: { label: string, isPositive: boolean }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl border border-gray-100">
      <span className="text-xs font-bold mb-2 font-sans">{label}</span>
      <div className={cn(
        "px-2 py-1 rounded-md text-[11px] font-bold transition-all",
        isPositive ? "sign-pill-pos" : "sign-pill-neg"
      )}>
        {isPositive ? `+ ${tr('positive', language)}` : `− ${tr('negative', language)}`}
      </div>
    </div>
  );
}

function SmallToggle({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
        active
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-gray-50 border-gray-200 text-gray-500 opacity-60 grayscale"
      )}
    >
      <div className={cn(
        "w-2.5 h-2.5 rounded-full",
        active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-gray-300"
      )} />
      <span className="text-xs font-bold whitespace-nowrap">{label}</span>
    </button>
  );
}

function UnitCircleCanvas({ state, onAngleChange }: { state: SimState, onAngleChange: (a: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const stateRef = useRef(state);
  const onAngleChangeRef = useRef(onAngleChange);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { onAngleChangeRef.current = onAngleChange; }, [onAngleChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }
    containerRef.current.innerHTML = '';

    const sketch = (s: p5) => {
      let canvasSize = 400;
      let radius = 150;
      let dragging = false;

      s.setup = () => {
        const container = containerRef.current!;
        // Safety check: remove any existing canvases before creating a new one
        const existing = container.getElementsByTagName('canvas');
        for (let i = 0; i < existing.length; i++) existing[i].remove();

        const w = container.clientWidth || 400;
        const h = container.clientHeight || 400;
        canvasSize = Math.min(w, h);
        radius = canvasSize * 0.35;
        s.createCanvas(canvasSize, canvasSize);
      };

      s.windowResized = () => {
        const container = containerRef.current;
        if (container) {
          const w = container.clientWidth || 400;
          const h = container.clientHeight || 400;
          canvasSize = Math.min(w, h);
          radius = canvasSize * 0.35;
          s.resizeCanvas(canvasSize, canvasSize);
        }
      };

      s.draw = () => {
        const currentState = stateRef.current;
        s.background(255);
        s.push();
        s.translate(s.width / 2, s.height / 2);

        const currentRad = (currentState.angle * Math.PI) / 180;
        const x = radius * Math.cos(currentRad);
        const y = -radius * Math.sin(currentRad);

        // Quadrant Shading - More prominent
        s.noStroke();
        const quad = Math.floor(((currentState.angle % 360) + 360) % 360 / 90);
        const colors = [
          [232, 0, 29, 30], // Q1: Red
          [37, 79, 227, 30], // Q2: Blue
          [28, 171, 85, 30], // Q3: Green
          [147, 51, 234, 30] // Q4: Purple
        ];
        const [r, g, b, a] = colors[quad];
        s.fill(r, g, b, a);
        s.arc(0, 0, radius * 2, radius * 2, -((quad + 1) * Math.PI) / 2, -(quad * Math.PI) / 2);

        // Highlight active quadrant border
        s.stroke(r, g, b, 100);
        s.strokeWeight(1);
        s.arc(0, 0, radius * 2, radius * 2, -((quad + 1) * Math.PI) / 2, -(quad * Math.PI) / 2);

        // 45-degree shadow lines (Reference)
        s.stroke(17, 24, 39, 30);
        s.strokeWeight(1);
        (s.drawingContext as any).setLineDash([5, 5]);
        [45, 135, 225, 315].forEach(a => {
          const ar = (a * Math.PI) / 180;
          s.line(0, 0, radius * Math.cos(ar), -radius * Math.sin(ar));
        });
        (s.drawingContext as any).setLineDash([]);

        // Main Axes - Bold Black
        s.stroke(0, 0, 0);
        s.strokeWeight(2.5);
        s.line(-radius - 40, 0, radius + 40, 0);
        s.line(0, -radius - 40, 0, radius + 40);

        // Labels
        s.fill(0, 0, 0);
        s.noStroke();
        s.textSize(16);
        s.textStyle(s.BOLD);
        s.textAlign(s.CENTER, s.CENTER);

        // X and X'
        s.text('X', radius + 60, 0);
        s.text("X'", -radius - 60, 0);

        // Y and Y'
        s.text('Y', 0, -radius - 60);
        s.text("Y'", 0, radius + 60);
        s.textStyle(s.NORMAL); // Reset

        // Circle
        s.noFill();
        s.stroke(17, 24, 39, 80);
        s.strokeWeight(2);
        s.circle(0, 0, radius * 2);

        // Arc Visualization
        const isArcVisible = !currentState.isBlinkingArc || (s.frameCount % 60 < 30);
        if (isArcVisible) {
          s.stroke(0); // Changed to Black
          s.strokeWeight(4);
          s.noFill();
          s.arc(0, 0, radius * 2, radius * 2, -currentRad, 0);
        }

        // Projection Lines
        const areLinesVisible = !currentState.isBlinkingLines || (s.frameCount % 60 < 30);
        if (areLinesVisible) {
          s.strokeWeight(1.5);
          (s.drawingContext as any).setLineDash([5, 5]);
          s.stroke('#274FE3');
          s.line(x, y, x, 0);
          s.stroke('#1CAB55');
          s.line(x, y, 0, y);
          (s.drawingContext as any).setLineDash([]);
        }

        // Symmetry Ghost Points
        if (currentState.showSymmetry) {
          const symAngles = [
            (180 - currentState.angle) % 360,
            (180 + currentState.angle) % 360,
            (360 - currentState.angle) % 360
          ];
          s.strokeWeight(1);
          s.stroke(17, 24, 39, 50);
          symAngles.forEach(a => {
            const ar = (a * Math.PI) / 180;
            const sx = radius * Math.cos(ar);
            const sy = -radius * Math.sin(ar);
            s.noFill();
            (s.drawingContext as any).setLineDash([5, 5]);
            s.line(0, 0, sx, sy);
            (s.drawingContext as any).setLineDash([]);
            s.fill(255);
            s.stroke(17, 24, 39, 80);
            s.circle(sx, sy, 8);
          });
        }

        // Projection Lines (Handled above with blinking)

        // Reference Triangle
        if (currentState.showTriangle) {
          s.stroke(17, 24, 39, 40);
          s.line(0, 0, x, y);
          s.line(x, y, x, 0);
          s.line(0, 0, x, 0);
          const sz = 10;
          const sx = x > 0 ? -1 : 1;
          const sy = y > 0 ? 1 : -1;
          s.noFill();
          s.stroke(17, 24, 39, 40);
          s.rect(x, 0, sx * sz, sy * sz);
        }

        // Main Radius Line
        s.stroke(0); // Black
        s.strokeWeight(3);
        s.line(0, 0, x, y);

        // Draggable Point
        const isHovered = s.dist(s.mouseX - s.width / 2, s.mouseY - s.height / 2, x, y) < 20;
        const special = SPECIAL_ANGLES.find(a => Math.abs(((currentState.angle % 360) + 360) % 360 - a) < 2);

        if (special !== undefined) {
          s.noStroke();
          s.fill(0, 0, 0, 20);
          s.circle(x, y, 30);
        }

        s.stroke(255);
        s.strokeWeight(2);
        s.fill(0); // Black
        s.circle(x, y, isHovered || dragging ? 18 : 14);

        // Values at point
        if (isHovered || dragging || special !== undefined) {
          s.noStroke();
          s.fill(17, 24, 39);
          s.textAlign(s.LEFT);
          s.textSize(11);
          const lab = getSpecialLabel(currentState.angle);
          if (lab) {
            s.text(`(${lab.cosRaw}, ${lab.sinRaw})`, x + 12, y - 5);
          } else {
            s.text(`(${(x / radius).toFixed(2)}, ${(-y / radius).toFixed(2)})`, x + 12, y - 5);
          }
        }

        // Handle Dragging
        if (s.mouseIsPressed) {
          const dx = s.mouseX - s.width / 2;
          const dy = -(s.mouseY - s.height / 2);
          if (dragging || s.dist(dx, -dy, x, y) < 40) {
            dragging = true;
            let targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
            if (targetAngle < 0) targetAngle += 360;
            const snapAngle = SPECIAL_ANGLES.find(a => Math.abs(targetAngle - a) < 3);
            onAngleChangeRef.current(snapAngle !== undefined ? snapAngle : targetAngle);
          }
        } else {
          dragging = false;
        }
        s.pop();
      };
    };

    p5InstanceRef.current = new p5(sketch, containerRef.current);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-white cursor-crosshair overflow-hidden" />;
}

function WaveGraph({ angle }: { angle: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive sizing
    const dpr = window.devicePixelRatio || 1;
    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const centerY = h / 2;
    const amp = h / 2 - 20;
    const padding = 25;
    const samples = w - padding * 2;
    const normAngle = ((angle % 360) + 360) % 360;

    // Draw Grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    // Horizontal lines
    [0.5, 1].forEach(v => {
      ctx.beginPath(); ctx.moveTo(padding, centerY - v * amp); ctx.lineTo(w - padding, centerY - v * amp); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(padding, centerY + v * amp); ctx.lineTo(w - padding, centerY + v * amp); ctx.stroke();
    });
    // Vertical lines (90 deg intervals)
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i / 4) * samples;
      ctx.beginPath(); ctx.moveTo(x, centerY - amp); ctx.lineTo(x, centerY + amp); ctx.stroke();
    }

    // Main Axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding - 5, centerY);
    ctx.lineTo(w - padding + 5, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, centerY - amp - 5);
    ctx.lineTo(padding, centerY + amp + 5);
    ctx.stroke();

    // Sine Wave (Green)
    ctx.strokeStyle = '#1CAB55';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const a = (i / samples) * 360;
      const x = padding + i;
      const y = centerY - Math.sin((a * Math.PI) / 180) * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Cosine Wave (Blue)
    ctx.strokeStyle = '#274FE3';
    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const a = (i / samples) * 360;
      const x = padding + i;
      const y = centerY - Math.cos((a * Math.PI) / 180) * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Indicator
    const indicatorX = padding + (normAngle / 360) * samples;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(indicatorX, centerY - amp - 5);
    ctx.lineTo(indicatorX, centerY + amp + 5);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tracking Dots
    const sy = centerY - Math.sin((normAngle * Math.PI) / 180) * amp;
    const cy = centerY - Math.cos((normAngle * Math.PI) / 180) * amp;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(indicatorX, sy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();

    ctx.beginPath(); ctx.arc(indicatorX, cy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('1.0', padding - 8, centerY - amp + 3);
    ctx.fillText('0', padding - 8, centerY + 3);
    ctx.fillText('-1.0', padding - 8, centerY + amp + 3);

  }, [angle]);

  return (
    <div ref={containerRef} className="w-full h-full bg-white rounded-lg">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}
