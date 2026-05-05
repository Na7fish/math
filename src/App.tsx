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
  Shapes
} from 'lucide-react';
import { cn, getSpecialLabel, toBengaliNumber, SPECIAL_ANGLES } from './lib/utils';
import QuadraticSim from './QuadraticSim';
import GeometrySim from './GeometrySim';

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
  const [activeSim, setActiveSim] = useState<ActiveSim>('Home');
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
          setCosInput(special.cos);
          setSinInput(special.sin);
          setTanInput(special.tan);
          setAngleInput(state.unit === 'deg' ? Math.round(state.angle).toString() : special.rad);
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
       <div className="min-h-screen bg-gray-50 flex flex-col font-bangla text-ten-ink">
         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-center px-6 shrink-0 shadow-sm">
            <h1 className="text-2xl font-bold text-red-600">10MS Math Laboratory</h1>
         </header>
         <main className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">সহজে গণিত বুঝি</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <SimChoiceCard 
                  title="ত্রিকোণমিতি: রেডিয়ান ও ডিগ্রি পরিমাপের সম্পর্ক" 
                  desc="কোণ, সাইন, কোসাইন এবং ট্যাঞ্জেন্টের জ্যামিতিক ধারণা"
                  icon={<Activity className="w-12 h-12 text-red-600" />}
                  onClick={() => {
                    setState({
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
                    setActiveSim('Trigonometry');
                  }}
                />
                <SimChoiceCard 
                  title="বীজগণিত: দ্বিঘাত সমীকরণ" 
                  desc="Standard Form, Vertex Form এবং Parabola এর বৈশিষ্ট্য"
                  icon={<Target className="w-12 h-12 text-red-600" />}
                  onClick={() => setActiveSim('Quadratics')}
                />
                <SimChoiceCard 
                  title="জ্যামিতির সকল আলোচনা" 
                  desc="বিভিন্ন চ্যাপ্টার এর উপপাদ্য নিয়ে বিস্তারিত ধারণা"
                  icon={<Shapes className="w-12 h-12 text-red-600" />}
                  subject="গণিত"
                  onClick={() => setActiveSim('Geometry')}
                />
            </div>
         </main>
       </div>
     );
  }

  return (
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
          <h1 className="text-sm md:text-xl font-bold truncate">
            {activeSim === 'Trigonometry' ? 'ইউনিট সার্কেল সিমুলেশন' : 
             activeSim === 'Quadratics' ? 'দ্বিঘাত সমীকরণ ল্যাব' : 'জ্যামিতি ল্যাব'}
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <span className="hidden sm:inline text-sm font-medium text-gray-500">
             {activeSim === 'Trigonometry' ? 'অধ্যায় ৮: ত্রিকোণমিতি' : 
              activeSim === 'Quadratics' ? 'অধ্যায় ৫: সমীকরণ' : ''}
          </span>
          <div className="px-2 py-0.5 md:px-3 md:py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap">নবম-দশম শ্রেণি: গণিত</div>
        </div>
      </header>

      {activeSim === 'Trigonometry' ? (
        <main className="flex-1 p-2 md:p-5 grid grid-cols-12 gap-3 md:gap-4 max-w-7xl mx-auto w-full auto-rows-min lg:auto-rows-fr overflow-y-auto">
          {/* Top Bento Row: Angle Control */}
          <div className="col-span-12 bento-card flex flex-col sm:flex-row items-center px-4 md:px-6 py-3 md:py-4 justify-between bg-white gap-4">
            <div className="flex items-center gap-4 md:gap-8 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">কোণের মান নির্ণয় করি</span>
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
                    className="text-xl md:text-2xl font-bold w-24 md:w-32 border-none px-2 py-1 focus:ring-0 mono bg-gray-50 rounded-lg shadow-inner text-gray-700"
                    placeholder="মান লিখুন"
                  />
                  <span className="text-xl md:text-2xl font-bold -ml-2">{state.unit === 'deg' ? '°' : ''}</span>
                  <span className="text-gray-400 font-mono text-xs md:text-sm ml-2">
                    ≈ {state.unit === 'deg' ? (rad).toFixed(2) + ' ব্যাসার্ধ' : Math.round(state.angle) + '°'}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-gray-600">
              <span>বিন্দুটি টেনে কোণ পরিবর্তন করো</span>
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              </div>
            </div>
          </div>

          {/* Left Grid: Simulation Canvas */}
          <div className="col-span-12 lg:col-span-7 lg:row-span-5 flex flex-col gap-4">
            <div className="bento-card relative overflow-hidden flex items-center justify-center bg-white aspect-square lg:aspect-auto flex-1 min-h-[400px]">
               <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                 <span className={cn(
                   "text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm border-2",
                   quadrant === 1 ? "bg-gray-50 text-gray-800 border-gray-200" :
                   quadrant === 2 ? "bg-gray-50 text-gray-800 border-gray-200" :
                   quadrant === 3 ? "bg-gray-50 text-gray-800 border-gray-200" :
                   "bg-gray-50 text-gray-800 border-gray-200"
                 )}>
                   QUADRANT {['I', 'II', 'III', 'IV'][quadrant - 1]} ({toBengaliNumber(quadrant)}ম পাদ)
                 </span>
               </div>
               
               <UnitCircleCanvas state={state} onAngleChange={updateAngle} />
            </div>
          </div>

          {/* Right Grid: Stats & Controls */}
          <div className="col-span-12 lg:col-span-5 lg:row-span-5 flex flex-col gap-4 overflow-y-auto">
            
            {/* Coordinates Bento Box */}
            <section className="bento-card p-5 flex flex-col justify-start">
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest pb-1">কোণের মান অনুযায়ী সকল তথ্য</span>
              
              <div className="mt-6 space-y-4">
                {/* Detailed Summary Info - Always Visible */}
                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-100">
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                    <span className="text-[10px] text-red-600 font-bold uppercase block mb-1">রেডিয়ান মান</span>
                    <span className="text-xl font-bold text-red-700 font-mono">
                      {specialLabels ? specialLabels.rad : (rad).toFixed(2) + ' rad'}
                    </span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                    <span className="text-[10px] text-red-600 font-bold uppercase block mb-1">স্থানাঙ্ক বিন্দু</span>
                    <span className="text-sm font-bold text-red-700 font-mono">
                      ({specialLabels ? specialLabels.cos : cosVal.toFixed(3)}, {specialLabels ? specialLabels.sin : sinVal.toFixed(3)})
                    </span>
                  </div>
                </div>
                
                <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between min-h-[68px] border-b border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-info">cos θ <span className="text-xs opacity-60 font-normal ml-1">(ভূজ)</span></span>
                    <span className="text-[10px] text-info opacity-50 uppercase font-bold tracking-tighter">X = COS(θ)</span>
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
                      {specialLabels?.cos && <div className="text-[10px] text-info font-bold uppercase">{specialLabels.cos}</div>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between min-h-[68px] border-b border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-success">sin θ <span className="text-xs opacity-60 font-normal ml-1">(কোটি)</span></span>
                    <span className="text-[10px] text-success opacity-50 uppercase font-bold tracking-tighter">Y = SIN(θ)</span>
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
                      {specialLabels?.sin && <div className="text-[10px] text-success font-bold uppercase">{specialLabels.sin}</div>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between min-h-[68px]">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-warn">tan θ <span className="text-xs opacity-60 font-normal ml-1">(ঢাল)</span></span>
                    <span className="text-[10px] text-warn opacity-50 uppercase font-bold tracking-tighter">m = SIN/COS</span>
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
            <section className="bento-card p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">সেটিংস</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <SmallToggle 
                  label="X এবং Y রেখা ব্লিঙ্কিং" 
                  active={state.isBlinkingLines} 
                  onClick={() => setState(prev => ({ ...prev, isBlinkingLines: !prev.isBlinkingLines }))} 
                />
                <SmallToggle 
                  label="রেডিয়ান রেখা ব্লিঙ্কিং" 
                  active={state.isBlinkingArc} 
                  onClick={() => setState(prev => ({ ...prev, isBlinkingArc: !prev.isBlinkingArc }))} 
                />
                <SmallToggle 
                  label="অটো রোটেশন" 
                  active={state.isAutoRotating} 
                  onClick={() => setState(s => ({ ...s, isAutoRotating: !s.isAutoRotating }))} 
                />
              </div>
            </section>

            {/* Wave Graph Section */}
            <section className="bento-card p-5 flex flex-col gap-3 bg-white">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sin(সাইন) ও Cos(কোসাইন) এর গ্রাফ</span>
               <div className="h-40 w-full">
                 <WaveGraph angle={state.angle} />
               </div>
               <div className="flex justify-between items-center px-1">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-1 bg-[#1CAB55] rounded-full" />
                   <span className="text-[10px] font-bold text-gray-500">Sin(সাইন)</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-1 bg-[#274FE3] rounded-full" />
                   <span className="text-[10px] font-bold text-gray-500">Cos(কোসাইন)</span>
                 </div>
               </div>
            </section>
          </div>
        </main>
      ) : activeSim === 'Quadratics' ? (
        <QuadraticSim />
      ) : (
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <GeometrySim />
        </main>
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-[10px] text-gray-400 font-sans border-t bg-white uppercase tracking-widest shrink-0">
        © 2026 10 Minute School | Science Division | SSC Prep
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function SimChoiceCard({ title, desc, icon, subject = "উচ্চতর গণিত", onClick }: { title: string, desc: string, icon: React.ReactNode, subject?: string, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-red-500 transition-all text-left shadow-lg flex flex-col gap-4 group relative"
    >
      <div className="absolute top-4 right-4 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[9px] md:text-[10px] font-bold border border-gray-200">নবম-দশম শ্রেণি: {subject}</div>
      <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-red-50 transition-colors w-fit">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 font-sans leading-relaxed">{desc}</p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-ten-red font-bold font-sans">
        সিমুলেশন শুরু করুন <ChevronRight className="w-4 h-4" />
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
        {isPositive ? '+ ধনাত্মক' : '− ঋণাত্মক'}
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
              s.text(`(${lab.cos}, ${lab.sin})`, x + 12, y - 5);
           } else {
              s.text(`(${(x/radius).toFixed(2)}, ${(-y/radius).toFixed(2)})`, x + 12, y - 5);
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
