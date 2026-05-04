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

// --- Types ---
type QuadMode = 'Explore' | 'Standard' | 'Vertex' | 'Focus';

interface QuadState {
  mode: QuadMode;
  a: number;
  b: number;
  c: number;
  h: number;
  k: number;
  showVertex: boolean;
  showAoS: boolean;
  showEquations: boolean;
  showCoordinates: boolean;
  showFocus: boolean;
  showDirectrix: boolean;
}

// --- Component ---

export default function QuadraticSim() {
  const [activeMenu, setActiveMenu] = useState<boolean>(true);
  const [state, setState] = useState<QuadState>({
    mode: 'Explore',
    a: 1,
    b: 0,
    c: 0,
    h: 0,
    k: 0,
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

  const handleReset = () => {
    setState({
      mode: state.mode,
      a: 1,
      b: 0,
      c: 0,
      h: 0,
      k: 0,
      showVertex: true,
      showAoS: false,
      showEquations: true,
      showCoordinates: true,
      showFocus: true,
      showDirectrix: true,
    });
  };

  if (activeMenu) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-6 md:p-12 overflow-y-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-16 text-center tracking-tight"
        >
          Graphing Quadratics
        </motion.h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
          <MenuCard 
            title="Explore" 
            active 
            icon={<div className="w-full h-full bg-blue-50/10 flex items-center justify-center"><ParabolaIcon type="explore" /></div>}
            onClick={() => { setState(s => ({ ...s, mode: 'Explore' })); setActiveMenu(false); }}
          />
          <MenuCard 
            title="Standard Form" 
            icon={<div className="w-full h-full bg-gray-900 flex items-center justify-center border border-white/10"><ParabolaIcon type="standard" /></div>}
            onClick={() => { setState(s => ({ ...s, mode: 'Standard' })); setActiveMenu(false); }}
          />
          <MenuCard 
            title="Vertex Form" 
            icon={<div className="w-full h-full bg-gray-900 flex items-center justify-center border border-white/10"><ParabolaIcon type="vertex" /></div>}
            onClick={() => { setState(s => ({ ...s, mode: 'Vertex' })); setActiveMenu(false); }}
          />
          <MenuCard 
            title="Focus & Directrix" 
            icon={<div className="w-full h-full bg-gray-900 flex items-center justify-center border border-white/10"><ParabolaIcon type="focus" /></div>}
            onClick={() => { setState(s => ({ ...s, mode: 'Focus' })); setActiveMenu(false); }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#e8f8f8] font-sans">
      {/* Simulation Area */}
      <div className="flex-1 relative p-4 lg:p-8 flex items-center justify-center">
        <div className="w-full aspect-square max-w-[600px] bg-white rounded-lg shadow-xl border border-gray-200 relative overflow-hidden">
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
            className="absolute bottom-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:rotate-180 transition-transform duration-500 text-orange-500"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full md:w-[400px] bg-[#e8f8f8] border-l border-gray-200 p-6 flex flex-col gap-6 overflow-y-auto">
        
        {/* Equation Editor */}
        <section className="bg-[#f2f2f2] border border-gray-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
               <div className="w-4 h-1 bg-white rounded-full"></div>
             </div>
             <h3 className="text-xl italic font-serif tracking-wide">
               {state.mode === 'Standard' ? 'y = ax² + bx + c' : 'y = a(x - h)² + k'}
             </h3>
          </div>

          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-center gap-4 text-2xl font-serif py-4">
               <span>y =</span>
               <ValueEditor 
                 label="a" 
                 value={state.a} 
                 onChange={(v) => state.mode === 'Standard' ? updateFromStandard(v, state.b, state.c) : updateFromVertex(v, state.h, state.k)} 
                 color="text-green-700"
               />
               
               {state.mode === 'Standard' ? (
                 <>
                   <span className="mx-1">x² +</span>
                   <ValueEditor label="b" value={state.b} onChange={(v) => updateFromStandard(state.a, v, state.c)} color="text-purple-700" />
                   <span className="mx-1">x +</span>
                   <ValueEditor label="c" value={state.c} onChange={(v) => updateFromStandard(state.a, state.b, v)} color="text-blue-700" />
                 </>
               ) : (
                 <>
                   <span className="mx-1">( x -</span>
                   <ValueEditor label="h" value={state.h} onChange={(v) => updateFromVertex(state.a, v, state.k)} color="text-purple-700" />
                   <span className="mx-1">)² +</span>
                   <ValueEditor label="k" value={state.k} onChange={(v) => updateFromVertex(state.a, state.h, v)} color="text-blue-700" />
                 </>
               )}
             </div>

             <div className="flex justify-center gap-4 border-t border-gray-300 pt-4">
                <button className="p-3 bg-[#f8f8f8] border border-gray-400 rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] hover:bg-white transition-colors">
                  <Camera className="w-6 h-6 text-yellow-600" fill="#fbbf24" />
                </button>
                <button className="p-3 bg-[#f8f8f8] border border-gray-400 rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] hover:bg-white transition-colors">
                   <Eraser className="w-6 h-6 text-gray-400" />
                </button>
             </div>
          </div>
        </section>

        {/* Toggles */}
        <section className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm flex flex-col gap-4">
           <ToggleRow 
             label="Vertex" 
             icon={<div className="w-4 h-4 rounded-full bg-purple-700" />} 
             active={state.showVertex} 
             onClick={() => setState(s => ({ ...s, showVertex: !s.showVertex }))} 
           />
           <ToggleRow 
             label="Axis of Symmetry" 
             icon={<div className="w-1 h-4 bg-purple-700 dashed" style={{backgroundImage: 'linear-gradient(to bottom, currentColor 50%, transparent 50%)', backgroundSize: '1px 8px'}} />} 
             active={state.showAoS} 
             onClick={() => setState(s => ({ ...s, showAoS: !s.showAoS }))} 
           />
           <ToggleRow 
             label="Equations" 
             active={state.showEquations} 
             onClick={() => setState(s => ({ ...s, showEquations: !s.showEquations }))} 
           />
           <ToggleRow 
             label="Coordinates" 
             active={state.showCoordinates} 
             onClick={() => setState(s => ({ ...s, showCoordinates: !s.showCoordinates }))} 
           />
           {state.mode === 'Focus' && (
             <>
               <ToggleRow 
                 label="Focus" 
                 icon={<div className="w-3 h-3 rounded-full bg-green-700" />} 
                 active={state.showFocus} 
                 onClick={() => setState(s => ({ ...s, showFocus: !s.showFocus }))} 
               />
               <ToggleRow 
                 label="Directrix" 
                 icon={<div className="w-4 h-0.5 bg-green-700" />} 
                 active={state.showDirectrix} 
                 onClick={() => setState(s => ({ ...s, showDirectrix: !s.showDirectrix }))} 
               />
             </>
           )}
        </section>

        <button 
           onClick={() => setActiveMenu(true)}
           className="mt-auto px-6 py-3 bg-gray-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Change Mode
        </button>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function MenuCard({ title, icon, onClick, active = false }: { title: string, icon: React.ReactNode, onClick: () => void, active?: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer group flex flex-col gap-4",
        active ? "opacity-100" : "opacity-80 hover:opacity-100"
      )}
    >
      <div className={cn(
        "aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all",
        active ? "border-yellow-400 p-2 bg-yellow-400" : "border-transparent group-hover:border-white/20"
      )}>
        <div className="w-full h-full rounded-md overflow-hidden bg-[#f0ffff]">
          {icon}
        </div>
      </div>
      <h2 className={cn(
        "text-3xl font-medium text-center transition-colors",
        active ? "text-white" : "text-gray-400 group-hover:text-white"
      )}>
        {title}
      </h2>
    </motion.div>
  );
}

function ValueEditor({ label, value, onChange, color }: { label: string, value: number, onChange: (v: number) => void, color: string }) {
  return (
    <div className="flex flex-col items-center group relative">
       <div className="flex flex-col -gap-1 mb-1">
          <button 
            onClick={() => onChange(value + 0.1)}
            className="p-1 px-2 hover:bg-gray-200 rounded transition-colors text-green-600 font-bold"
          >
            ▲
          </button>
          <div className={cn("px-3 py-1 bg-white border border-gray-300 rounded shadow-inner min-w-[3rem] text-center font-bold", color)}>
            {Number.isInteger(value) ? value : value.toFixed(1)}
          </div>
          <button 
             onClick={() => onChange(value - 0.1)}
            className="p-1 px-2 hover:bg-gray-200 rounded transition-colors text-purple-600 font-bold"
          >
            ▼
          </button>
       </div>
       <span className="text-xs uppercase text-gray-400 font-bold">{label}</span>
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
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ccc" />
        </marker>
      </defs>
      {/* Grid */}
      <line x1="10" y1="50" x2="90" y2="50" stroke="#eee" strokeWidth="1" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="#eee" strokeWidth="1" />
      
      {/* Parabola */}
      <path 
        d={type === 'explore' || type === 'vertex' || type === 'standard' ? "M 20 20 Q 50 80 80 20" : "M 20 80 Q 50 20 80 80"} 
        stroke="black" 
        strokeWidth="4" 
        fill="none" 
        transform={type === 'explore' ? 'scale(1, -1) translate(0, -100)' : ''}
      />
      
      {/* Feature elements */}
      {type === 'vertex' && <circle cx="50" cy="80" r="4" fill="#a855f7" />}
      {type === 'standard' && (
        <>
          <circle cx="30" cy="50" r="3" fill="#3b82f6" />
          <circle cx="70" cy="50" r="3" fill="#3b82f6" />
          <circle cx="50" cy="80" r="4" fill="#a855f7" />
        </>
      )}
      {type === 'focus' && (
        <>
          <circle cx="50" cy="35" r="3" fill="green" />
          <line x1="10" y1="75" x2="90" y2="75" stroke="green" strokeWidth="2" strokeDasharray="4" />
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
        s.translate(canvasSize / 2, canvasSize / 2);
        
        // Draw Grid
        s.stroke(220);
        s.strokeWeight(1);
        for (let i = -10; i <= 10; i++) {
          s.line(i * scale, -canvasSize/2, i * scale, canvasSize/2);
          s.line(-canvasSize/2, i * scale, canvasSize/2, i * scale);
        }

        // Axes
        s.stroke(100);
        s.strokeWeight(2);
        s.line(-canvasSize/2, 0, canvasSize/2, 0);
        s.line(0, -canvasSize/2, 0, canvasSize/2);
        
        // Parabola points calculation
        s.noFill();
        s.stroke(0);
        s.strokeWeight(4);
        s.beginShape();
        for (let rx = -canvasSize/2; rx <= canvasSize/2; rx += 2) {
          const ux = rx / scale;
          // y = a(x-h)^2 + k
          const uy = curr.a * Math.pow(ux - curr.h, 2) + curr.k;
          const ry = -uy * scale; // Invert for cartesian
          if (ry > -canvasSize/2 && ry < canvasSize/2) {
            s.vertex(rx, ry);
          }
        }
        s.endShape();

        // Axis of Symmetry
        if (curr.showAoS) {
          s.stroke(168, 85, 247, 150); // purple
          s.strokeWeight(2);
          (s.drawingContext as any).setLineDash([5, 10]);
          s.line(curr.h * scale, -canvasSize/2, curr.h * scale, canvasSize/2);
          (s.drawingContext as any).setLineDash([]);
        }

        // Directrix
        if (curr.mode === 'Focus' && curr.showDirectrix) {
          const p_val = 1 / (4 * curr.a);
          const dy = curr.k - p_val;
          s.stroke(22, 163, 74, 150); // green
          s.strokeWeight(3);
          (s.drawingContext as any).setLineDash([8, 8]);
          s.line(-canvasSize/2, -dy * scale, canvasSize/2, -dy * scale);
          (s.drawingContext as any).setLineDash([]);
        }

        // Focus
        if (curr.mode === 'Focus' && curr.showFocus) {
          const p_val = 1 / (4 * curr.a);
          const fy = curr.k + p_val;
          s.fill(22, 163, 74);
          s.noStroke();
          s.circle(curr.h * scale, -fy * scale, 10);
        }

        // Vertex
        if (curr.showVertex) {
          const vx = curr.h * scale;
          const vy = -curr.k * scale;
          s.fill(168, 85, 247);
          s.stroke(255);
          s.strokeWeight(2);
          s.circle(vx, vy, 16);
          
          if (curr.showCoordinates) {
            s.noStroke();
            s.fill(168, 85, 247);
            s.textAlign(s.CENTER);
            s.textSize(14);
            s.text(`(${curr.h.toFixed(1)}, ${curr.k.toFixed(1)})`, vx, vy + 30);
          }
        }

        // Handle Vertex Interactivity
        if (s.mouseIsPressed) {
          const mx = (s.mouseX - canvasSize / 2) / scale;
          const my = -(s.mouseY - canvasSize / 2) / scale;
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
