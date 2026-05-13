/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  Target, 
  Layers, 
  ChevronRight,
  Eye,
  Camera,
  Eraser,
  Grid3X3,
  GitCommitHorizontal,
  Move
} from 'lucide-react';
import { cn } from './lib/utils';
import { useLang } from './lib/LanguageContext';
import { tr } from './lib/translations';
import MathText from './components/MathText';

// --- Types ---
type QuadMode = 'Explore' | 'Standard' | 'Vertex' | 'Focus';

interface QuadState {
  mode: QuadMode;
  a: number;
  b: number;
  c: number;
  h: number;
  k: number;
  snapshot: { a: number, h: number, k: number } | null;
  showVertex: boolean;
  showAoS: boolean;
  showEquations: boolean;
  showCoordinates: boolean;
  showFocus: boolean;
  showDirectrix: boolean;
}

// --- Component ---

export default function QuadraticSim() {
  const language = useLang();
  const [activeMenu, setActiveMenu] = useState<boolean>(true);
  const [state, setState] = useState<QuadState>({
    mode: 'Explore',
    a: 1,
    b: 0,
    c: 0,
    h: 0,
    k: 0,
    snapshot: null,
    showVertex: true,
    showAoS: false,
    showEquations: true,
    showCoordinates: true,
    showFocus: true,
    showDirectrix: true,
  });

  // Calculate dependent values
  // Vertex form from Standard: h = -b/(2a), k = c - b^2/(4a)
  // Standard from Vertex: a=a, b=-2ah, c=ah^2+k
  
  const updateFromStandard = (a: number, b: number, c: number) => {
    const h = -b / (2 * a);
    const k = c - (b * b) / (4 * a);
    setState(prev => ({ ...prev, a, b, c, h, k }));
  };

  const updateFromVertex = (a: number, h: number, k: number) => {
    const b = -2 * a * h;
    const c = a * h * h + k;
    setState(prev => ({ ...prev, a, b, c, h, k }));
  };

  const takeSnapshot = () => {
    setState(s => ({ ...s, snapshot: { a: s.a, h: s.h, k: s.k } }));
  };

  const clearSnapshot = () => {
    setState(s => ({ ...s, snapshot: null }));
  };

  const resetToMode = (mode: QuadMode) => {
    setState({
      mode,
      a: 1,
      b: 0,
      c: 0,
      h: 0,
      k: 0,
      snapshot: null,
      showVertex: true,
      showAoS: false,
      showEquations: true,
      showCoordinates: true,
      showFocus: true,
      showDirectrix: true,
    });
    setActiveMenu(false);
  };

  const handleReset = () => {
    resetToMode(state.mode);
  };

  if (activeMenu) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-900 p-6 md:p-12 overflow-y-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-7xl font-bold mb-8 md:mb-16 text-center tracking-tight text-gray-900 px-4"
        >
          {tr('quadPageTitle', language)}
        </motion.h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
          <MenuCard 
            title={tr('quadModeExplore', language)} 
            icon={<ParabolaIcon type="explore" />}
            onClick={() => resetToMode('Explore')}
          />
          <MenuCard 
            title={tr('quadModeStandard', language)} 
            icon={<ParabolaIcon type="standard" />}
            onClick={() => resetToMode('Standard')}
          />
          <MenuCard 
            title={tr('quadModeVertex', language)} 
            icon={<ParabolaIcon type="vertex" />}
            onClick={() => resetToMode('Vertex')}
          />
          <MenuCard 
            title={tr('quadModeFocus', language)} 
            icon={<ParabolaIcon type="focus" />}
            onClick={() => resetToMode('Focus')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-gray-50 font-sans overflow-hidden">
      {/* Simulation Area */}
      <div className="flex-1 relative p-2 md:p-4 flex items-center justify-center bg-gray-50 overflow-hidden min-h-[350px] md:min-h-0">
        <div className="w-full aspect-square max-w-[800px] bg-white rounded-lg shadow-xl border border-gray-200 relative overflow-hidden">
          <QuadraticCanvas 
            state={state} 
            onChange={(h, k) => updateFromVertex(state.a, h, k)}
          />
          
          <div className="absolute bottom-4 left-4 z-10 flex gap-2">
             <button className="p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm border border-gray-200 hover:bg-white transition-colors" title="View">
               <Eye className="w-5 h-5 text-gray-700" />
             </button>
          </div>
          
          <button 
            onClick={handleReset}
            className="absolute bottom-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:rotate-180 transition-transform duration-500 text-red-600"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full md:w-[480px] bg-white border-l border-gray-200 p-4 md:p-6 flex flex-col gap-4 md:gap-6 overflow-y-auto">
        
        {/* Equation Editor */}
        <section className="bg-[#f2f2f2] border border-gray-300 rounded-xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
             <h3 className="text-lg md:text-xl italic font-serif tracking-wide text-gray-700 text-center">
               <MathText math={
                 state.mode === 'Focus' 
                   ? 'y = \\frac{1}{4p}(x - h)^2 + k' 
                   : (state.mode === 'Standard' || state.mode === 'Explore') ? 'y = ax^2 + bx + c' : 'y = a(x - h)^2 + k'
               } />
             </h3>
          </div>

          <div className="flex flex-col gap-4">
             <div className="flex flex-wrap items-center justify-center gap-2 text-xl md:text-2xl font-serif py-2 w-full">
               <span className="italic">y =</span>
               {state.mode === 'Focus' ? (
                 <div className="flex flex-col items-center">
                   <div className="text-sm px-4">1</div>
                   <div className="h-px w-full bg-gray-500 my-0.5"></div>
                   <div className="text-lg flex items-center gap-0.5">
                     4(
                     <ValueEditor 
                        label="p" 
                        value={1/(4*state.a)} 
                        onChange={(v) => updateFromVertex(1/(4*(v || 0.1)), state.h, state.k)} 
                        color="text-red-700" 
                      />
                     )
                   </div>
                 </div>
               ) : (
                 <ValueEditor 
                   label="a" 
                   value={state.a} 
                   onChange={(v) => (state.mode === 'Standard' || state.mode === 'Explore') ? updateFromStandard(v, state.b, state.c) : updateFromVertex(v, state.h, state.k)} 
                   color="text-red-700"
                 />
               )}
               
               {(state.mode === 'Standard' || state.mode === 'Explore') ? (
                 <>
                   <span className="mx-1 italic whitespace-nowrap text-gray-700">x² +</span>
                   <ValueEditor label="b" value={state.b} onChange={(v) => updateFromStandard(state.a, v, state.c)} color="text-gray-900" />
                   <span className="mx-1 italic whitespace-nowrap text-gray-700">x +</span>
                   <ValueEditor label="c" value={state.c} onChange={(v) => updateFromStandard(state.a, state.b, v)} color="text-red-600" />
                 </>
               ) : (
                 <>
                   <div className="flex items-center gap-1 text-gray-700">
                      <span className="text-3xl">(</span>
                      <span className="italic">x</span>
                      <span className="mx-1">-</span>
                   </div>
                   <ValueEditor label="h" value={state.h} onChange={(v) => updateFromVertex(state.a, v, state.k)} color="text-gray-900" />
                   <div className="flex items-center gap-1 text-gray-700">
                      <span className="text-3xl">)</span>
                      <span className="text-lg">²</span>
                      <span className="mx-1">+</span>
                   </div>
                   <ValueEditor label="k" value={state.k} onChange={(v) => updateFromVertex(state.a, state.h, v)} color="text-red-600" />
                 </>
               )}
             </div>

              <div className="flex justify-center gap-4 border-t border-gray-300 pt-4">
                 <button 
                   onClick={() => {
                     console.log("Taking snapshot", state.a, state.h, state.k);
                     takeSnapshot();
                   }}
                   className={cn(
                     "p-3 border rounded-lg shadow-sm transition-all active:scale-95",
                     state.snapshot ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-300 hover:bg-white"
                   )}
                   title="Take Snapshot"
                 >
                   <Camera className="w-3.5 h-3.5" fill={state.snapshot ? "currentColor" : "none"} />
                    {tr('quadCompare', language)}
                 </button>
                 <button 
                   onClick={() => {
                     console.log("Clearing snapshot");
                     clearSnapshot();
                   }}
                   className={cn(
                     "p-3 border rounded-lg shadow-sm transition-all active:scale-95",
                     state.snapshot ? "bg-white border-gray-400 hover:bg-gray-50" : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                   )}
                   disabled={!state.snapshot}
                   title="Clear Snapshot"
                 >
                    <Eraser className="w-3.5 h-3.5" />
                     {tr('quadClear', language)}
                 </button>
              </div>
          </div>
        </section>

        {/* Toggles */}
        <section className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm flex flex-col gap-4">
           <ToggleRow 
             label={tr('quadVertex', language)} 
             icon={<div className="w-4 h-4 rounded-full bg-red-600" />} 
             active={state.showVertex} 
             onClick={() => setState(s => ({ ...s, showVertex: !s.showVertex }))} 
           />
           <ToggleRow 
             label={tr('quadAoS', language)} 
             icon={<div className="w-1 h-4" style={{backgroundImage: 'linear-gradient(to bottom, #dc2626 50%, #000000 50%)', backgroundSize: '100% 8px'}} />} 
             active={state.showAoS} 
             onClick={() => setState(s => ({ ...s, showAoS: !s.showAoS }))} 
           />
           <ToggleRow 
             label={tr('quadEquations', language)} 
             active={state.showEquations} 
             onClick={() => setState(s => ({ ...s, showEquations: !s.showEquations }))} 
           />
           <ToggleRow 
             label={tr('quadCoords', language)} 
             active={state.showCoordinates} 
             onClick={() => setState(s => ({ ...s, showCoordinates: !s.showCoordinates }))} 
           />
           {state.mode === 'Focus' && (
             <>
               <ToggleRow 
                 label={tr('quadFocus', language)} 
                 icon={<div className="w-3 h-3 rounded-full bg-black" />} 
                 active={state.showFocus} 
                 onClick={() => setState(s => ({ ...s, showFocus: !s.showFocus }))} 
               />
               <ToggleRow 
                 label={tr('quadDirectrix', language)} 
                 icon={<div className="w-4 h-0.5 bg-red-600" />} 
                 active={state.showDirectrix} 
                 onClick={() => setState(s => ({ ...s, showDirectrix: !s.showDirectrix }))} 
               />
             </>
           )}
        </section>
        
        {/* Information Panel (Equation Details) */}
        <section className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm flex flex-col gap-4">
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{tr('quadInfoTitle', language)}</h3>
           <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">{tr('quadVertexLbl', language)}</span>
                <span className="font-bold text-red-600">
                  <MathText math={`(${Math.abs(state.h) > 1000 ? state.h.toExponential(1) : parseFloat(state.h.toFixed(2))}, ${Math.abs(state.k) > 1000 ? state.k.toExponential(1) : parseFloat(state.k.toFixed(2))})`} />
                </span>
              </div>
              {state.mode === 'Focus' && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">{tr('quadFocusLbl', language)}</span>
                    <span className="font-bold text-black">
                      <MathText math={`(${parseFloat(state.h.toFixed(2))}, ${parseFloat((state.k + 1/(4*(state.a || 0.1))).toFixed(2))})`} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">{tr('quadDirectrixLbl', language)}</span>
                    <span className="font-bold text-red-600">
                      <MathText math={`y = ${parseFloat((state.k - 1/(4*(state.a || 0.1))).toFixed(2))}`} />
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">{tr('quadYIntercept', language)}</span>
                <span className="font-bold"><MathText math={`c = ${parseFloat(state.c.toFixed(2))}`} /></span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">{tr('quadRoots', language)}</span>
                <span className="font-bold text-gray-800">
                  {(() => {
                    const a = state.a || 0.0001;
                    const discriminant = state.b * state.b - 4 * a * state.c;
                    if (discriminant < 0) return tr('quadNoRoots', language);
                    if (discriminant === 0) return <MathText math={`x = ${parseFloat((-state.b / (2 * a)).toFixed(2))}`} />;
                    const x1 = (-state.b + Math.sqrt(discriminant)) / (2 * a);
                    const x2 = (-state.b - Math.sqrt(discriminant)) / (2 * a);
                    return <MathText math={`x = ${parseFloat(x1.toFixed(2))}, ${parseFloat(x2.toFixed(2))}`} />;
                  })()}
                </span>
              </div>
           </div>
        </section>

        <button 
           onClick={() => setActiveMenu(true)}
           className="mt-auto px-6 py-3 bg-gray-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {tr('quadChangeMode', language)}
        </button>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function MenuCard({ title, icon, onClick, active = false }: { title: string, icon: React.ReactNode, onClick: () => void, active?: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer group flex flex-col gap-4 bg-white p-4 rounded-2xl border-2 transition-all shadow-md hover:shadow-lg",
        active ? "border-red-500 ring-4 ring-red-50" : "border-gray-200"
      )}
    >
      <div className={cn(
        "aspect-[4/3] rounded-xl overflow-hidden transition-all",
        active ? "bg-red-50" : "bg-gray-100"
      )}>
        <div className="w-full h-full p-4">
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h2 className={cn(
          "text-xl font-bold transition-colors",
          active ? "text-red-600" : "text-gray-700 group-hover:text-red-500"
        )}>
          {title}
        </h2>
      </div>
    </motion.div>
  );
}

function ValueEditor({ label, value, onChange, color }: { label: string, value: number, onChange: (v: number) => void, color: string }) {
  return (
    <div className="flex flex-col items-center group relative">
       <div className="flex flex-col -gap-1 mb-1">
          <button 
            onClick={() => onChange(value + 0.1)}
            className="p-2 md:p-1 px-4 md:px-2 hover:bg-gray-200 rounded transition-all text-green-600 font-bold active:scale-125"
          >
            ▲
          </button>
          <div className={cn("px-2 md:px-3 py-1 bg-white border border-gray-300 rounded shadow-inner min-w-[2.5rem] md:min-w-[3rem] text-center font-bold text-sm md:text-base", color)}>
            {parseFloat(value.toFixed(1))}
          </div>
          <button 
             onClick={() => onChange(value - 0.1)}
            className="p-2 md:p-1 px-4 md:px-2 hover:bg-gray-200 rounded transition-all text-purple-600 font-bold active:scale-125"
          >
            ▼
          </button>
       </div>
       <span className="text-[10px] md:text-xs italic text-gray-400 font-bold">{label}</span>
    </div>
  );
}

function ToggleRow({ label, icon, active, onClick }: { label: string, icon?: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <div className="flex items-center gap-3">
       <button 
         onClick={onClick}
         className={cn(
           "w-6 h-6 rounded flex items-center justify-center border-2 transition-all",
           active ? "bg-white border-black text-black" : "bg-white border-gray-300 text-transparent"
         )}
       >
         {active && <div className="w-3 h-3 bg-black rounded-sm" />}
       </button>
       <span className="text-lg font-medium text-gray-800">{label}</span>
       {icon && <div className="ml-auto">{icon}</div>}
    </div>
  );
}

function ParabolaIcon({ type }: { type: QuadMode | 'standard' | 'vertex' | 'explore' | 'focus' }) {
  const colors = {
    blue: "#ef4444",
    purple: "#dc2626",
    green: "#991b1b"
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full bg-transparent">
      {/* Main Parabola Curves */}
      {type === 'explore' && (
        <path d="M 10 85 Q 50 -55 90 85" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}

      {type === 'standard' && (
        <>
          <path d="M 10 15 Q 50 155 90 15" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="black" strokeWidth="1" opacity="0.3" />
          <circle cx="18" cy="40" r="5" fill="white" stroke="#dc2626" strokeWidth="3" />
          <circle cx="82" cy="40" r="5" fill="white" stroke="#dc2626" strokeWidth="3" />
          <circle cx="50" cy="85" r="7" fill="#dc2626" />
        </>
      )}

      {type === 'vertex' && (
        <>
          <path d="M 10 85 Q 50 -55 90 85" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="15" r="7" fill="#dc2626" />
        </>
      )}

      {type === 'focus' && (
        <>
          <path d="M 10 15 Q 50 155 90 15" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="45" r="7" fill="#dc2626" />
          <line x1="0" y1="95" x2="100" y2="95" stroke="#dc2626" strokeWidth="5" strokeDasharray="12,6" />
        </>
      )}
    </svg>
  );
}

// --- Canvas ---

function QuadraticCanvas({ state, onChange }: { state: QuadState, onChange: (h: number, k: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let p: p5;
    const sketch = (s: p5) => {
      let canvasSize = 600;
      let scale = 30; // pixels per unit
      let draggingVertex = false;

      s.setup = () => {
        const container = containerRef.current!;
        canvasSize = Math.min(container.clientWidth, container.clientHeight);
        const canvas = s.createCanvas(canvasSize, canvasSize);
        canvas.parent(container);
      };

      s.draw = () => {
        const curr = stateRef.current;
        s.clear();
        
        // Dynamic scale based on canvas size with padding
        const padding = 50;
        const availableSpace = canvasSize - padding * 2;
        scale = availableSpace / 20; // 20 units total (-10 to 10)

        s.translate(canvasSize / 2, canvasSize / 2);
        
        // Draw Grid
        s.stroke(242);
        s.strokeWeight(1);
        for (let i = -10; i <= 10; i++) {
          s.line(i * scale, -availableSpace/2, i * scale, availableSpace/2);
          s.line(-availableSpace/2, i * scale, availableSpace/2, i * scale);
        }

        // Axes
        s.stroke(60);
        s.strokeWeight(1.5);
        // X Axis
        s.line(-availableSpace/2 - 15, 0, availableSpace/2 + 15, 0);
        // Y Axis
        s.line(0, -availableSpace/2 - 15, 0, availableSpace/2 + 15);
        
        // Tick Marks and Numbers
        for (let i = -10; i <= 10; i++) {
          if (i === 0) continue;
          
          const pos = i * scale;
          
          // X Ticks
          s.stroke(60);
          s.line(pos, -5, pos, 5);
          
          // Y Ticks
          s.line(-5, pos, 5, pos);
          
          // Numbers (at 5 and 10)
          if (i % 5 === 0) {
            s.fill(60);
            s.noStroke();
            s.textSize(12);
            s.textStyle(s.NORMAL);
            // X Numbers
            s.textAlign(s.CENTER, s.TOP);
            s.text(i, pos, 12);
            // Y Numbers
            s.textAlign(s.RIGHT, s.CENTER);
            s.text(-i, -12, pos);
          }
        }

        // Axis Labels & Arrows (All 4 ends)
        s.fill(60);
        s.noStroke();
        s.textSize(16);
        s.textStyle(s.BOLD + s.ITALIC);
        
        // Positive Ends
        s.textAlign(s.CENTER, s.CENTER);
        s.text("x", availableSpace/2 + 30, 0);
        s.text("y", 0, -availableSpace/2 - 30);
        
        // Negative Ends (Prime)
        s.text("x'", -availableSpace/2 - 30, 0);
        s.text("y'", 0, availableSpace/2 + 30);
        
        // Arrows
        s.stroke(60);
        s.strokeWeight(1.5);
        // Right
        s.line(availableSpace/2 + 15, 0, availableSpace/2 + 7, -4);
        s.line(availableSpace/2 + 15, 0, availableSpace/2 + 7, 4);
        // Left
        s.line(-availableSpace/2 - 15, 0, -availableSpace/2 - 7, -4);
        s.line(-availableSpace/2 - 15, 0, -availableSpace/2 - 7, 4);
        // Top
        s.line(0, -availableSpace/2 - 15, -4, -availableSpace/2 - 7);
        s.line(0, -availableSpace/2 - 15, 4, -availableSpace/2 - 7);
        // Bottom
        s.line(0, availableSpace/2 + 15, -4, availableSpace/2 + 7);
        s.line(0, availableSpace/2 + 15, 4, availableSpace/2 + 7);
        
        // Snapshot Curve (if any)
        if (curr.snapshot) {
          s.noFill();
          s.stroke(100, 100, 100, 200); // Darker Ash color
          s.strokeWeight(3);
          (s.drawingContext as any).setLineDash([6, 6]);
          s.beginShape();
          for (let rx = -canvasSize/2; rx <= canvasSize/2; rx += 2) {
            const ux = rx / scale;
            const uy = curr.snapshot.a * Math.pow(ux - curr.snapshot.h, 2) + curr.snapshot.k;
            const ry = -uy * scale;
            if (ry > -canvasSize/2 && ry < canvasSize/2) {
              s.vertex(rx, ry);
            }
          }
          s.endShape();
          (s.drawingContext as any).setLineDash([]);
        }

        // Parabola points calculation
        s.noFill();
        s.stroke(220, 38, 38); // High-precision Red for curve
        s.strokeWeight(4);
        s.beginShape();
        for (let rx = -canvasSize/2; rx <= canvasSize/2; rx += 2) {
          const ux = rx / scale;
          const uy = curr.a * Math.pow(ux - curr.h, 2) + curr.k;
          const ry = -uy * scale;
          if (ry > -canvasSize/2 && ry < canvasSize/2) {
            s.vertex(rx, ry);
          }
        }
        s.endShape();

        // Axis of Symmetry
        if (curr.showAoS) {
          const ax = curr.h * scale;
          // Background Black Dash
          s.stroke(0);
          s.strokeWeight(3);
          s.line(ax, -canvasSize/2, ax, canvasSize/2);
          
          // Foreground Red Dash (Offset)
          s.stroke(220, 38, 38);
          (s.drawingContext as any).setLineDash([8, 8]);
          (s.drawingContext as any).lineDashOffset = 8;
          s.line(ax, -canvasSize/2, ax, canvasSize/2);
          (s.drawingContext as any).setLineDash([]);
          (s.drawingContext as any).lineDashOffset = 0;
        }

        // Directrix
        if (curr.mode === 'Focus' && curr.showDirectrix) {
          const p_val = 1 / (4 * curr.a);
          const dy = curr.k - p_val;
          s.stroke(220, 38, 38, 180);
          s.strokeWeight(3);
          (s.drawingContext as any).setLineDash([8, 8]);
          s.line(-canvasSize/2, -dy * scale, canvasSize/2, -dy * scale);
          (s.drawingContext as any).setLineDash([]);
        }

        // Focus
        if (curr.mode === 'Focus' && curr.showFocus) {
          const p_val = 1 / (4 * curr.a);
          const fy = curr.k + p_val;
          s.fill(0); // Black for Focus
          s.stroke(255);
          s.strokeWeight(2);
          s.circle(curr.h * scale, -fy * scale, 12);
        }

        // Vertex
        if (curr.showVertex) {
          const vx = curr.h * scale;
          const vy = -curr.k * scale;
          s.fill(220, 38, 38);
          s.stroke(255);
          s.strokeWeight(2);
          s.circle(vx, vy, 16);
          
          if (curr.showCoordinates) {
            s.noStroke();
            s.fill(220, 38, 38);
            s.textAlign(s.CENTER);
            s.textStyle(s.BOLD);
            s.textSize(14);
            s.text(`(${curr.h.toFixed(1)}, ${curr.k.toFixed(1)})`, vx, vy + 30);
          }
        }

        // Coordinate Display Box (Static)
        s.resetMatrix();
        s.fill(250, 250, 250, 230);
        s.stroke(200);
        s.strokeWeight(1);
        s.rect(20, canvasSize - 50, 140, 30, 5);
        s.fill(50);
        s.noStroke();
        s.textAlign(s.CENTER, s.CENTER);
        s.textStyle(s.NORMAL);
        const mx = (s.mouseX - canvasSize / 2) / scale;
        const my = -(s.mouseY - canvasSize / 2) / scale;
        const coordText = s.mouseX > 0 && s.mouseX < canvasSize && s.mouseY > 0 && s.mouseY < canvasSize 
          ? `(${mx.toFixed(1)}, ${my.toFixed(1)})` 
          : "(?, ?)";
        s.text(coordText, 90, canvasSize - 35);
        
        s.translate(canvasSize / 2, canvasSize / 2);

        // Equations on Canvas
        if (curr.showEquations) {
          s.resetMatrix();
          const isMobile = canvasSize < 500;
          const fontSize = isMobile ? 14 : 18;
          const padding = isMobile ? 15 : 25;
          
          s.textSize(fontSize);
          s.textStyle(s.BOLD);
          
          let eqStr = "";
          if (curr.mode === 'Standard' || curr.mode === 'Explore') {
            const aStr = parseFloat(curr.a.toFixed(1));
            const bStr = Math.abs(parseFloat(curr.b.toFixed(1)));
            const cStr = Math.abs(parseFloat(curr.c.toFixed(1)));
            const bSign = parseFloat(curr.b.toFixed(1)) >= 0 ? "+" : "-";
            const cSign = parseFloat(curr.c.toFixed(1)) >= 0 ? "+" : "-";
            eqStr = `y = ${aStr}x² ${bSign} ${bStr}x ${cSign} ${cStr}`;
          } else if (curr.mode === 'Focus') {
            const p = 1 / (4 * curr.a);
            const pStr = parseFloat(p.toFixed(1));
            const hStr = Math.abs(parseFloat(curr.h.toFixed(1)));
            const kStr = Math.abs(parseFloat(curr.k.toFixed(1)));
            const hSign = parseFloat(curr.h.toFixed(1)) >= 0 ? "-" : "+";
            const kSign = parseFloat(curr.k.toFixed(1)) >= 0 ? "+" : "-";
            eqStr = `y = 1/(4(${pStr}))(x ${hSign} ${hStr})² ${kSign} ${kStr}`;
          } else {
            const aStr = parseFloat(curr.a.toFixed(1));
            const hStr = Math.abs(parseFloat(curr.h.toFixed(1)));
            const kStr = Math.abs(parseFloat(curr.k.toFixed(1)));
            const hSign = parseFloat(curr.h.toFixed(1)) >= 0 ? "-" : "+";
            const kSign = parseFloat(curr.k.toFixed(1)) >= 0 ? "+" : "-";
            eqStr = `y = ${aStr}(x ${hSign} ${hStr})² ${kSign} ${kStr}`;
          }

          // Draw ash-colored background box
          const textW = s.textWidth(eqStr);
          s.fill(240, 242, 245, 210); // Ash color
          s.noStroke();
          s.rect(padding - 8, padding - 5, textW + 16, fontSize + 12, 6);

          s.fill(220, 38, 38); // Red for equation
          s.textAlign(s.LEFT, s.TOP);
          s.text(eqStr, padding, padding);
          s.translate(canvasSize / 2, canvasSize / 2);
        }

        // Handle Vertex Interactivity
        if (s.mouseIsPressed) {
          const vx = curr.h;
          const vy = curr.k;
          
          if (draggingVertex || s.dist(mx, my, vx, vy) < 1) {
            draggingVertex = true;
            onChange(Math.round(mx * 10) / 10, Math.round(my * 10) / 10);
          }
        } else {
          draggingVertex = false;
        }
      };
    };

    p = new p5(sketch);
    return () => p.remove();
  }, [onChange]); // Only recreation on fundamental changes

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center cursor-move" />;
}
