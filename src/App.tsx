/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  RotateCcw, 
  Settings2, 
  Activity, 
  Target, 
  Layers, 
  Info,
  Maximize2,
  Minimize2,
  Home,
  Menu,
  ChevronRight
} from 'lucide-react';
import { cn, getSpecialLabel, toBengaliNumber, SPECIAL_ANGLES } from './lib/utils';
import QuadraticSim from './QuadraticSim';

// --- Types ---
type ActiveSim = 'Trigonometry' | 'Quadratics' | 'Home';

interface SimState {
  angle: number; // in degrees
  unit: 'deg' | 'rad';
  showTriangle: boolean;
  showGraph: boolean;
  showSymmetry: boolean;
  showArc: boolean;
  isAutoRotating: boolean;
  rotationSpeed: number;
}

// --- Components ---

export default function App() {
  const [activeSim, setActiveSim] = useState<ActiveSim>('Home');
  const [state, setState] = useState<SimState>({
    angle: 30,
    unit: 'deg',
    showTriangle: true,
    showGraph: true,
    showSymmetry: false,
    showArc: true,
    isAutoRotating: false,
    rotationSpeed: 1,
  });

  const rad = (state.angle * Math.PI) / 180;
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);
  const tanVal = Math.abs(Math.cos(rad)) < 0.001 ? Infinity : Math.tan(rad);
  
  const quadrant = Math.floor(((state.angle % 360) + 360) % 360 / 90) + 1;
  const specialLabels = getSpecialLabel(state.angle);

  const updateAngle = (newAngle: number) => {
    setState(prev => ({ ...prev, angle: newAngle }));
  };

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
           <h1 className="text-2xl font-bold text-ten-red">10MS Math Laboratory</h1>
         </header>
         <main className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">সিমুলেশন নির্বাচন করুন</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
               <SimChoiceCard 
                 title="ত্রিকোণমিতি: ইউনিট সার্কেল" 
                 desc="কোণ, সাইন, কোসাইন এবং ট্যাঞ্জেন্টের জ্যামিতিক ধারণা"
                 icon={<Activity className="w-12 h-12 text-ten-red" />}
                 onClick={() => setActiveSim('Trigonometry')}
               />
               <SimChoiceCard 
                 title="বীজগণিত: দ্বিঘাত সমীকরণ" 
                 desc="Standard Form, Vertex Form এবং Parabola এর বৈশিষ্ট্য"
                 icon={<Target className="w-12 h-12 text-blue-600" />}
                 onClick={() => setActiveSim('Quadratics')}
               />
            </div>
         </main>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-bangla text-ten-ink select-none overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveSim('Home')}
            className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft width="20" height="20" className="text-gray-600 stroke-[2.5]" />
          </button>
          <h1 className="text-xl font-bold">
            {activeSim === 'Trigonometry' ? 'ইউনিট সার্কেল সিমুলেশন' : 'দ্বিঘাত সমীকরণ গ্রাফিং'}
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">
             {activeSim === 'Trigonometry' ? 'অধ্যায় ৩: ত্রিকোণমিতি' : 'অধ্যায় ৪: দ্বিঘাত সমীকরণ'}
          </span>
          <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold whitespace-nowrap">HSC গণিত ১ম</div>
        </div>
      </header>

      {activeSim === 'Trigonometry' ? (
        <main className="flex-1 p-5 grid grid-cols-12 gap-4 max-w-7xl mx-auto w-full auto-rows-min lg:auto-rows-fr overflow-y-auto">
          {/* Top Bento Row: Angle Control */}
          <div className="col-span-12 bento-card flex items-center px-6 py-4 justify-between bg-white">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">কোণের মান (Angle)</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={state.unit === 'deg' ? Math.round(state.angle) + '°' : (rad).toFixed(2)}
                    onChange={(e) => {
                      const valStr = e.target.value.replace('°', '');
                      const val = parseFloat(valStr) || 0;
                      if (state.unit === 'deg') updateAngle(val);
                      else updateAngle((val * 180) / Math.PI);
                    }}
                    className="text-2xl font-bold w-24 border-none p-0 focus:ring-0 mono bg-transparent"
                  />
                  <span className="text-gray-400 font-mono text-sm">
                    ≈ {state.unit === 'deg' ? (rad).toFixed(2) + ' rad' : Math.round(state.angle) + '°'}
                  </span>
                </div>
              </div>
              
              <div className="h-10 w-[1px] bg-gray-100"></div>
              
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setState(s => ({ ...s, unit: 'deg' }))}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                    state.unit === 'deg' ? "bg-white shadow-sm text-ten-red" : "text-gray-500"
                  )}
                >
                  DEG
                </button>
                <button 
                  onClick={() => setState(s => ({ ...s, unit: 'rad' }))}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                    state.unit === 'rad' ? "bg-white shadow-sm text-ten-red" : "text-gray-500"
                  )}
                >
                  RAD
                </button>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-gray-600">
              <span>বিন্দুটি টেনে কোণ পরিবর্তন করো</span>
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
            </div>
          </div>

          {/* Left Grid: Simulation Canvas */}
          <div className="col-span-12 lg:col-span-7 lg:row-span-5 flex flex-col gap-4">
            <div className="bento-card relative overflow-hidden flex items-center justify-center bg-white aspect-square lg:aspect-auto flex-1">
               <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                 <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded uppercase">
                   QUADRANT {['I', 'II', 'III', 'IV'][quadrant - 1]} ({toBengaliNumber(quadrant)}ম পাদ)
                 </span>
               </div>
               
               <UnitCircleCanvas state={state} onAngleChange={updateAngle} />
               
               <div className="absolute bottom-4 right-4 text-[10px] text-gray-400 uppercase font-bold">
                 Radius = 1 Unit
               </div>
            </div>

            {/* Linked Graph (P1) */}
            <AnimatePresence>
              {state.showGraph && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bento-card overflow-hidden"
                >
                  <div className="p-3 px-4 border-b border-gray-100 flex items-center justify-between">
                     <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Activity className="w-3 h-3 text-ten-red" />
                       সাইন/কোসাইন গ্রাফ
                     </h3>
                  </div>
                  <div className="h-40 w-full">
                    <GraphCanvas state={state} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Grid: Stats & Controls */}
          <div className="col-span-12 lg:col-span-5 lg:row-span-5 flex flex-col gap-4 overflow-y-auto">
            
            {/* Coordinates Bento Box */}
            <section className="bento-card p-5 flex-1 flex flex-col justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">স্থানাঙ্ক (Coordinates)</span>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">cos θ <span className="text-xs text-gray-400 font-normal ml-1">(ভূজ)</span></span>
                  <div className="text-right">
                    <span className="text-2xl font-bold mono text-info">
                      {cosVal >= 0 ? '+' : ''}{cosVal.toFixed(3)}
                    </span>
                    {specialLabels?.cos && <div className="text-[10px] text-info font-bold uppercase">{specialLabels.cos}</div>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">sin θ <span className="text-xs text-gray-400 font-normal ml-1">(কোটি)</span></span>
                  <div className="text-right">
                    <span className="text-2xl font-bold mono text-success">
                      {sinVal >= 0 ? '+' : ''}{sinVal.toFixed(3)}
                    </span>
                    {specialLabels?.sin && <div className="text-[10px] text-success font-bold uppercase">{specialLabels.sin}</div>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">tan θ <span className="text-xs text-gray-400 font-normal ml-1">(ঢাল)</span></span>
                  <span className="text-2xl font-bold mono text-warn">
                    {tanVal === Infinity ? "∞" : (tanVal >= 0 ? '+' : '') + tanVal.toFixed(3)}
                  </span>
                </div>
              </div>
            </section>

            {/* Signs Bento Box */}
            <section className="bento-card p-5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">চিহ্ন প্যানেল (Signs)</span>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <SignPill label="sin θ" isPositive={sinVal >= 0} />
                <SignPill label="cos θ" isPositive={cosVal >= 0} />
                <SignPill label="tan θ" isPositive={tanVal >= 0 || tanVal === Infinity} />
              </div>
            </section>

            {/* Settings / Toggles */}
            <section className="bento-card p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">টগল সেটিংস</span>
                <button 
                  onClick={() => setState(s => ({ ...s, isAutoRotating: !s.isAutoRotating }))}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold transition-all uppercase",
                    state.isAutoRotating ? "bg-ten-red text-white" : "bg-gray-100 text-gray-500"
                  )}
                >
                  {state.isAutoRotating ? "পাখি বন্ধ করো" : "অটো রোটেশন"}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <SmallToggle 
                  label="রেফারেন্স ত্রিভুজ" 
                  active={state.showTriangle} 
                  onClick={() => setState(s => ({ ...s, showTriangle: !s.showTriangle }))} 
                />
                <SmallToggle 
                  label="সাইন গ্রাফ" 
                  active={state.showGraph} 
                  onClick={() => setState(s => ({ ...s, showGraph: !s.showGraph }))} 
                />
                <SmallToggle 
                  label="প্রতিসাম্য" 
                  active={state.showSymmetry} 
                  onClick={() => setState(s => ({ ...s, showSymmetry: !s.showSymmetry }))} 
                />
                <SmallToggle 
                  label="রেডিয়ান আর্ক" 
                  active={state.showArc} 
                  onClick={() => setState(s => ({ ...s, showArc: !s.showArc }))} 
                />
              </div>
            </section>
          </div>
        </main>
      ) : (
        <QuadraticSim />
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-[10px] text-gray-400 font-sans border-t bg-white uppercase tracking-widest shrink-0">
        © 2026 10 Minute School | Science Division | HSC Prep
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function SimChoiceCard({ title, desc, icon, onClick }: { title: string, desc: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-ten-red transition-all text-left shadow-lg flex flex-col gap-4 group"
    >
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


// --- Subcomponents ---

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

// --- P5 Simulation Components ---

function UnitCircleCanvas({ state, onAngleChange }: { state: SimState, onAngleChange: (a: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p: p5;
    const sketch = (s: p5) => {
      let canvasSize = 400;
      let radius = 150;
      let dragging = false;

      s.setup = () => {
        const container = containerRef.current!;
        canvasSize = Math.min(container.clientWidth, container.clientHeight || 500);
        radius = canvasSize * 0.35;
        const canvas = s.createCanvas(canvasSize, canvasSize);
        canvas.parent(container);
      };

      s.windowResized = () => {
         const container = containerRef.current;
         if (container) {
           canvasSize = Math.min(container.clientWidth, container.clientHeight || 500);
           radius = canvasSize * 0.35;
           s.resizeCanvas(canvasSize, canvasSize);
         }
      };

      s.draw = () => {
        s.clear();
        s.translate(canvasSize / 2, canvasSize / 2);

        const currentRad = (state.angle * Math.PI) / 180;
        const x = radius * Math.cos(currentRad);
        const y = -radius * Math.sin(currentRad); // p5 y is downwards

        // Quadrant Shading
        s.noStroke();
        const quad = Math.floor(((state.angle % 360) + 360) % 360 / 90);
        s.fill(232, 0, 29, 15);
        s.arc(0, 0, radius * 2, radius * 2, -((quad + 1) * Math.PI) / 2, -(quad * Math.PI) / 2);

        // Axes
        s.stroke(17, 24, 39, 40);
        s.strokeWeight(1.5);
        s.line(-radius - 30, 0, radius + 30, 0); // X-axis
        s.line(0, -radius - 30, 0, radius + 30); // Y-axis
        
        // Labels
        s.fill(17, 24, 39, 100);
        s.noStroke();
        s.textSize(12);
        s.textAlign(s.CENTER, s.CENTER);
        s.text('X', radius + 50, 0);
        s.text('Y', 0, -radius - 50);

        // Circle
        s.noFill();
        s.stroke(17, 24, 39, 80);
        s.strokeWeight(2);
        s.circle(0, 0, radius * 2);

        // Arc Visualization
        if (state.showArc) {
           s.stroke(232, 0, 29);
           s.strokeWeight(4);
           s.noFill();
           s.arc(0, 0, radius * 2, radius * 2, -currentRad, 0);
        }

        // Symmetry Ghost Points
        if (state.showSymmetry) {
           const symAngles = [
             (180 - state.angle) % 360,
             (180 + state.angle) % 360,
             (360 - state.angle) % 360
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

        // Projection Lines (Dashed)
        s.strokeWeight(1.5);
        (s.drawingContext as any).setLineDash([5, 5]);
        
        // Cos projection (on x axis)
        s.stroke('#274FE3'); // info blue
        s.line(x, y, x, 0);
        
        // Sin projection (on y axis)
        s.stroke('#1CAB55'); // success green
        s.line(x, y, 0, y);
        
        (s.drawingContext as any).setLineDash([]);

        // Reference Triangle
        if (state.showTriangle) {
          s.stroke(17, 24, 39, 40);
          s.line(0, 0, x, y); // Hypotenuse
          s.line(x, y, x, 0); // Opposite
          s.line(0, 0, x, 0); // Adjacent
          
          // Right angle marker
          const sz = 10;
          const sx = x > 0 ? -1 : 1;
          const sy = y > 0 ? 1 : -1;
          s.noFill();
          s.stroke(17, 24, 39, 40);
          s.rect(x, 0, sx * sz, sy * sz);
        }

        // Main Radius Line
        s.stroke('#E8001D');
        s.strokeWeight(3);
        s.line(0, 0, x, y);

        // Draggable Point
        const isHovered = s.dist(s.mouseX - canvasSize / 2, s.mouseY - canvasSize / 2, x, y) < 20;
        const special = SPECIAL_ANGLES.find(a => Math.abs(((state.angle % 360) + 360) % 360 - a) < 2);
        
        if (special !== undefined) {
           s.noStroke();
           s.fill(232, 0, 29, 40);
           s.circle(x, y, 30);
        }

        s.stroke(255);
        s.strokeWeight(2);
        s.fill('#E8001D');
        s.circle(x, y, isHovered || dragging ? 18 : 14);

        // Values at point
        if (isHovered || dragging || special !== undefined) {
           s.noStroke();
           s.fill(17, 24, 39);
           s.textAlign(s.LEFT);
           s.textSize(11);
           const lab = getSpecialLabel(state.angle);
           if (lab) {
              s.text(`(${lab.cos}, ${lab.sin})`, x + 12, y - 5);
           } else {
              s.text(`(${(x/radius).toFixed(2)}, ${(-y/radius).toFixed(2)})`, x + 12, y - 5);
           }
        }

        // Handle Dragging
        if (s.mouseIsPressed) {
          const dx = s.mouseX - canvasSize / 2;
          const dy = -(s.mouseY - canvasSize / 2);
          if (dragging || s.dist(dx, -dy, x, y) < 40) {
            dragging = true;
            let targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
            if (targetAngle < 0) targetAngle += 360;
            
            // Snap logic
            const snapAngle = SPECIAL_ANGLES.find(a => Math.abs(targetAngle - a) < 3);
            onAngleChange(snapAngle !== undefined ? snapAngle : targetAngle);
          }
        } else {
          dragging = false;
        }
      };
    };

    p = new p5(sketch);
    return () => p.remove();
  }, [state, onAngleChange]);

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-white cursor-crosshair" />;
}

function GraphCanvas({ state }: { state: SimState }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p: p5;
    const sketch = (s: p5) => {
      s.setup = () => {
        const container = containerRef.current!;
        s.createCanvas(container.clientWidth, container.clientHeight);
      };

      s.draw = () => {
        s.background(255);
        const w = s.width;
        const h = s.height;
        const midY = h / 2;
        const amplitude = h * 0.35;

        // Axes
        s.stroke(17, 24, 39, 30);
        s.strokeWeight(1);
        s.line(30, midY, w - 30, midY); // X-axis
        s.line(30, 10, 30, h - 10);    // Y-axis
        
        // Draw Sine Wave
        s.noFill();
        s.stroke('#1CAB55'); // success green
        s.strokeWeight(2);
        s.beginShape();
        for (let x = 30; x < w - 30; x++) {
          const angle = s.map(x, 30, w - 30, 0, 360);
          const y = midY - s.sin((angle * Math.PI) / 180) * amplitude;
          s.vertex(x, y);
        }
        s.endShape();

        // Draw Cosine Wave
        s.stroke('#274FE3'); // info blue
        s.strokeWeight(1.5);
        (s.drawingContext as any).setLineDash([4, 4]);
        s.beginShape();
        for (let x = 30; x < w - 30; x++) {
          const angle = s.map(x, 30, w - 30, 0, 360);
          const y = midY - s.cos((angle * Math.PI) / 180) * amplitude;
          s.vertex(x, y);
        }
        s.endShape();
        (s.drawingContext as any).setLineDash([]);

        // Current Angle Line
        const currentX = s.map(state.angle % 360, 0, 360, 30, w - 30);
        s.stroke(232, 0, 29);
        s.strokeWeight(1.5);
        s.line(currentX, 10, currentX, h - 10);
        
        // Traveling Dot
        const currentY = midY - s.sin((state.angle * Math.PI) / 180) * amplitude;
        s.fill(232, 0, 29);
        s.noStroke();
        s.circle(currentX, currentY, 8);
        
        // Labels
        s.fill(17, 24, 39, 100);
        s.textSize(10);
        s.text('0°', 30, midY + 15);
        s.text('360°', w - 50, midY + 15);
        s.textAlign(s.RIGHT);
        s.text('sin θ', w - 35, midY - amplitude - 5);
      };
    };

    p = new p5(sketch);
    return () => p.remove();
  }, [state]);

  return <div ref={containerRef} className="w-full h-full" />;
}
