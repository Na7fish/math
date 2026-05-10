import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, MousePointer2, Play, RotateCcw, BookOpen, ChevronRight } from 'lucide-react';
import { cn } from './lib/utils';
import MathText from './components/MathText';

interface Point {
  x: number;
  y: number;
}

// --- Shared Components ---
const SidebarProof = ({ steps, step, setStep }: { steps: any[], step: number, setStep: React.Dispatch<React.SetStateAction<number>> }) => (
  <div className="lg:col-span-5 flex flex-col gap-6 w-full lg:w-[450px]">
    <section className="bento-card p-6 flex flex-col gap-4 bg-white border-l-4 border-l-red-500">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">{steps[step].title}</h3>
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
          <Info className="w-5 h-5" />
        </div>
      </div>
      <p className="text-gray-800 text-lg leading-relaxed font-sans whitespace-pre-line">
        <MathText math={steps[step].content} />
      </p>
      
      <div className="flex items-center gap-4 mt-4">
        <button 
          disabled={step === 0}
          onClick={() => setStep(s => s - 1)}
          className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-100 font-bold text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          পূর্ববর্তী
        </button>
        <button 
          disabled={step === steps.length - 1}
          onClick={() => setStep(s => s + 1)}
          className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
        >
          পরবর্তী ধাপ <Play className="w-4 h-4 fill-current" />
        </button>
      </div>
    </section>

    <section className="bento-card p-6 bg-gray-50/50 flex flex-col gap-2">
      {step === steps.length - 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 text-sm font-bold flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">✓</div>
          উপপাদ্যটি সফলভাবে প্রমাণিত হয়েছে!
        </motion.div>
      )}

      <button 
        onClick={() => setStep(0)}
        className="w-full py-3 px-4 rounded-xl border-2 border-red-100 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" /> আবার শুরু করুন
      </button>
    </section>
  </div>
);

// --- Theorem 14 ---
const Theorem14: React.FC = () => {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const A = { x: 300, y: 100 };
  const B = { x: 150, y: 400 };
  const C = { x: 550, y: 400 };
  const D = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const E = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
  const F = { x: 2 * E.x - D.x, y: 2 * E.y - D.y };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Base Triangle
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (step >= 1) {
      ctx.beginPath();
      ctx.moveTo(D.x, D.y);
      ctx.lineTo(F.x, F.y);
      ctx.strokeStyle = '#EF4444';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.beginPath();
      ctx.moveTo(C.x, C.y);
      ctx.lineTo(F.x, F.y);
      ctx.strokeStyle = '#10B981';
      ctx.stroke();
    }

    if (step === 2) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(D.x, D.y); ctx.lineTo(E.x, E.y); ctx.fill();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.lineTo(E.x, E.y); ctx.lineTo(F.x, F.y); ctx.fill();
    }

    if (step === 3) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(D.x, D.y); ctx.lineTo(F.x, F.y); ctx.lineTo(C.x, C.y); ctx.fill();
    }

    const drawPoint = (p: Point, label: string, color: string = '#111827') => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
      ctx.fillStyle = color; ctx.font = 'bold 16px sans-serif'; ctx.fillText(label, p.x - 10, p.y - 10);
    };

    drawPoint(A, 'A'); drawPoint(B, 'B'); drawPoint(C, 'C');
    drawPoint(D, 'D', '#EF4444'); drawPoint(E, 'E', '#EF4444');
    if (step >= 1) drawPoint(F, 'F', '#3B82F6');

  }, [step]);

  const steps = [
    { title: "বিশেষ নির্বচন", content: "মনে করি, ABC একটি ত্রিভুজ। D ও E যথাক্রমে ত্রিভুজটির AB ও AC বাহুর মধ্যবিন্দু। তাহলে, প্রমাণ করতে হবে যে DE ∥ BC এবং DE = ½BC।", badge: "বিশেষ নির্বচন" },
    { title: "অঙ্কন", content: "D ও E যোগ করে বর্ধিত করি যেন EF = DE হয়। এরপর C ও F যোগ করি।", badge: "অঙ্কন" },
    { title: "প্রমাণ: ধাপ ১", content: `∆ADE ও ∆CEF এর মধ্যে, \nAE = EC [দেওয়া আছে]\nDE = EF [অঙ্কনানুসারে]\nঅন্তর্ভুক্ত ∠AED = অন্তর্ভুক্ত ∠CEF [বিপ্রতীপ কোণ]\n∴ ∆ADE ≅ ∆CEF [বাহু-কোণ-বাহু উপপাদ্য]\n∴ ∠ADE = ∠EFC [একান্তর কোণ]\n∴ AD ∥ CF\nআবার, BD = AD = CF এবং BD ∥ CF।\nসুতরাং BDFC একটি সামান্তরিক।\n∴ DF ∥ BC বা DE ∥ BC।`, badge: "ধাপ ১" },
    { title: "প্রমাণ: ধাপ ২", content: `আবার, DF = BC বা DE + EF = BC\nবা DE + DE = BC বা 2DE = BC \nবা DE = ½BC\n∴ DE ∥ BC এবং DE = ½BC।`, badge: "ধাপ ২" }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="lg:col-span-7 flex flex-col gap-4 flex-1">
        <div className="bento-card p-0 bg-white relative overflow-hidden aspect-video lg:aspect-auto lg:h-[600px] flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
             <MousePointer2 className="w-3 h-3" /> নির্দেশনা অনুযায়ী ধাপগুলো অনুসরণ করুন
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)} className={cn("h-2 rounded-full transition-all", step === i ? "bg-red-500 w-full" : "bg-gray-200")} />
          ))}
        </div>
      </div>
      <SidebarProof steps={steps} step={step} setStep={setStep} />
    </div>
  );
};

// --- Theorem 18 ---
const Theorem18: React.FC = () => {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const radius = 150;

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineJoin = 'round';
    
    // Circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Chords AB and CD
    // AB chord
    const angle1 = Math.PI / 4;
    const angle2 = 3 * Math.PI / 4;
    const Ax = cx + radius * Math.cos(angle1);
    const Ay = cy - radius * Math.sin(angle1);
    const Bx = cx + radius * Math.cos(angle2);
    const By = cy - radius * Math.sin(angle2);

    // CD chord (equal distance from center)
    const angle3 = 5 * Math.PI / 4;
    const angle4 = 7 * Math.PI / 4;
    const Cx = cx + radius * Math.cos(angle3);
    const Cy = cy - radius * Math.sin(angle3);
    const Dx = cx + radius * Math.cos(angle4);
    const Dy = cy - radius * Math.sin(angle4);

    ctx.beginPath();
    ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By);
    ctx.moveTo(Cx, Cy); ctx.lineTo(Dx, Dy);
    ctx.strokeStyle = '#374151';
    ctx.stroke();

    // Center O
    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fillStyle = '#111827'; ctx.fill();
    ctx.font = 'bold 18px sans-serif'; 
    ctx.fillText('O', cx + 12, cy + 5);

    // Perpendiculars OE, OF
    const Ex = (Ax + Bx) / 2;
    const Ey = (Ay + By) / 2;
    const Fx = (Cx + Dx) / 2;
    const Fy = (Cy + Dy) / 2;

    if (step >= 1) {
      ctx.beginPath();
      ctx.moveTo(cx, cy); ctx.lineTo(Ex, Ey);
      ctx.moveTo(cx, cy); ctx.lineTo(Fx, Fy);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Right angle marks
      ctx.setLineDash([]);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1;
      // Mark for OE
      ctx.strokeRect(Ex - 5, Ey, 10, 10);
      // Mark for OF
      ctx.strokeRect(Fx - 5, Fy - 10, 10, 10);
    }

    if (step >= 2) {
      ctx.beginPath();
      ctx.moveTo(cx, cy); ctx.lineTo(Ax, Ay);
      ctx.moveTo(cx, cy); ctx.lineTo(Cx, Cy);
      ctx.strokeStyle = '#3B82F6';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (step === 3) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(Ax, Ay); ctx.lineTo(Ex, Ey); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(Cx, Cy); ctx.lineTo(Fx, Fy); ctx.fill();
    }

    const drawPoint = (x: number, y: number, label: string, align: 'left' | 'right' | 'top' | 'bottom' | 'center-right' = 'top') => {
       ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = '#111827'; ctx.fill();
       ctx.fillStyle = '#111827';
       ctx.font = 'bold 18px sans-serif';
       let ox = 8, oy = -8;
       if (align === 'right') { ox = 12; oy = 5; }
       if (align === 'left') { ox = -25; oy = 5; }
       if (align === 'bottom') { ox = -5; oy = 25; }
       if (align === 'top') { ox = -5; oy = -15; }
       ctx.fillText(label, x + ox, y + oy);
    };

    drawPoint(Ax, Ay, 'A', 'right'); drawPoint(Bx, By, 'B', 'left');
    drawPoint(Cx, Cy, 'C', 'left'); drawPoint(Dx, Dy, 'D', 'right');
    if (step >= 1) {
      drawPoint(Ex, Ey, 'E', 'top'); drawPoint(Fx, Fy, 'F', 'bottom');
    }

  }, [step]);

  const steps = [
    { title: "বিশেষ নির্বচন", content: "মনে করি, O বৃত্তের কেন্দ্র এবং AB ও CD বৃত্তের দুইটি সমান জ্যা। প্রমাণ করতে হবে যে, O থেকে AB এবং CD জ্যাদ্বয় সমদূরবর্তী।", badge: "বিশেষ নির্বচন" },
    { title: "অঙ্কন", content: "O থেকে AB এবং CD জ্যা এর উপর যথাক্রমে OE এবং OF লম্ব রেখাংশ আঁকি। O, A এবং O, C যোগ করি।", badge: "অঙ্কন" },
    { title: "প্রমাণ: ধাপ ১", content: `OE ⊥ AB এবং OF ⊥ CD সুতরাং, AE = BE এবং CF = DF [$\because$ কেন্দ্র থেকে ব্যাস ভিন্ন যেকোনো জ্যা এর উপর অঙ্কিত লম্ব জ্যাকে সমদ্বিখন্ডিত করে]\n\n∴ AE = ½AB এবং CF = ½CD`, badge: "ধাপ ১" },
    { title: "প্রমাণ: ধাপ ২", content: `কিন্তু AB = CD [ধরে নেয়া]\n\n∴ AE = CF`, badge: "ধাপ ২" },
    { title: "প্রমাণ: ধাপ ৩", content: `এখন ∆OAE এবং ∆OCF সমকোণী ত্রিভুজদ্বয়ের মধ্যে অতিভুজ OA = অতিভুজ OC [উভয়ে একই বৃত্তের ব্যাসার্ধ] এবং AE = CF [ধাপ ২]\n\n∴ ∆OAE ≅ ∆OCF [সমকোণী ত্রিভুজের অতিভুজ-বাহু সর্বসমতা উপপাদ্য]\n\n∴ OE = OF`, badge: "ধাপ ৩" },
    { title: "প্রমাণ: ধাপ ৪", content: `কিন্তু OE এবং OF কেন্দ্র O থেকে যথাক্রমে AB জ্যা এবং CD জ্যা এর দূরত্ব।\n\nসুতরাং, AB এবং CD জ্যাদ্বয় বৃত্তের কেন্দ্র থেকে সমদূরবর্তী।`, badge: "ধাপ ৪" }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="lg:col-span-7 flex flex-col gap-4 flex-1">
        <div className="bento-card p-0 bg-white relative overflow-hidden aspect-video lg:aspect-auto lg:h-[600px] flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
             <MousePointer2 className="w-3 h-3" /> নির্দেশনা অনুযায়ী ধাপগুলো অনুসরণ করুন
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)} className={cn("h-2 rounded-full transition-all", step === i ? "bg-red-500 w-full" : "bg-gray-200")} />
          ))}
        </div>
      </div>
      <SidebarProof steps={steps} step={step} setStep={setStep} />
    </div>
  );
};

// --- Theorem 35 ---
const Theorem35: React.FC = () => {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Calculate centering offsets
    const groupWidth = 440;
    const groupHeight = 200;
    const startX = (rect.width - groupWidth) / 2;
    const startY = (rect.height - groupHeight) / 2;

    // Triangle 1: ABC
    const A = { x: startX + 100, y: startY };
    const B = { x: startX, y: startY + 200 };
    const C = { x: startX + 200, y: startY + 200 };
    const G = { x: startX + 100, y: startY + 200 };

    // Triangle 2: DEF (Scaled version)
    const scale = 0.7;
    const offsetX = 300;
    const D = { x: startX + offsetX + 100 * scale, y: startY + (1 - scale) * 200 };
    const E = { x: startX + offsetX, y: startY + 200 };
    const F = { x: startX + offsetX + 200 * scale, y: startY + 200 };
    const H = { x: startX + offsetX + 100 * scale, y: startY + 200 };

    const drawTri = (p1: Point, p2: Point, p3: Point, p4: Point, hLabel: string, label1: string, label2: string, label3: string, label4: string) => {
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.closePath();
      ctx.strokeStyle = '#374151'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = 'rgba(55, 65, 81, 0.05)'; ctx.fill();

      // Vertex Labels
      ctx.fillStyle = '#111827'; ctx.font = 'bold 18px sans-serif';
      ctx.fillText(label1, p1.x - 5, p1.y - 15);
      ctx.fillText(label2, p2.x - 25, p2.y + 5);
      ctx.fillText(label3, p3.x + 10, p3.y + 5);

      if (step >= 1) {
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p4.x, p4.y);
        ctx.strokeStyle = '#EF4444'; ctx.lineWidth = 2; ctx.stroke();
        ctx.strokeRect(p4.x - 5, p4.y - 10, 10, 10);
        
        ctx.fillStyle = '#EF4444';
        ctx.fillText(hLabel, p1.x + 8, (p1.y + p4.y)/2);
        
        ctx.fillStyle = '#111827';
        ctx.fillText(label4, p4.x - 5, p4.y + 25);
      }
    };

    drawTri(A, B, C, G, 'h', 'A', 'B', 'C', 'G');
    drawTri(D, E, F, H, 'p', 'D', 'E', 'F', 'H');

    if (step === 3) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(G.x, G.y); ctx.fill();
      ctx.beginPath(); ctx.moveTo(D.x, D.y); ctx.lineTo(E.x, E.y); ctx.lineTo(H.x, H.y); ctx.fill();
    }

    const drawPoint = (p: Point) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fillStyle = '#111827'; ctx.fill();
    };

    drawPoint(A); drawPoint(B); drawPoint(C);
    drawPoint(D); drawPoint(E); drawPoint(F);
    if (step >= 1) { drawPoint(G); drawPoint(H); }

  }, [step]);

  const steps = [
    { title: "বিশেষ নির্বচন", content: "মনে করি, ∆ABC ও ∆DEF ত্রিভুজদ্বয় সদৃশ এবং এদের অনুরূপ বাহু BC ও EF। প্রমাণ করতে হবে যে, ∆ABC : ∆DEF = BC² : EF²।", badge: "বিশেষ নির্বচন" },
    { title: "অঙ্কন", content: "BC ও EF এর উপর যথাক্রমে AG ও DH লম্ব আঁকি। মনে করি AG = h, DH = p।", badge: "অঙ্কন" },
    { title: "প্রমাণ: ধাপ ১", content: "∆ABC = ½ × BC × h এবং ∆DEF = ½ × EF × p।\n\n∴ ∆ABC / ∆DEF = (½ × BC × h) / (½ × EF × p) = (h / p) × (BC / EF)", badge: "ধাপ ১" },
    { title: "প্রমাণ: ধাপ ২", content: "ABG ও DEH ত্রিভুজদ্বয়ের ∠B = ∠E, ∠AGB = ∠DHE [এক সমকোণ] ∴ ∠BAG = ∠EDH।\n\n∴ ∆ABG ও ∆DEH ত্রিভুজদ্বয় সদৃশকোণী, তাই সদৃশ।\n\n∴ h / p = AB / DE = BC / EF [যেহেতু ∆ABC ও ∆DEF সদৃশ]", badge: "ধাপ ২" },
    { title: "প্রমাণ: ধাপ ৩", content: "ধাপ ১ হতে পাই,\n∆ABC / ∆DEF = (h / p) × (BC / EF)\n\nধাপ ২ এর মান বসিয়ে,\n∆ABC / ∆DEF = (BC / EF) × (BC / EF) = BC² / EF²\n\n∴ ∆ABC : ∆DEF = BC² : EF²।", badge: "ধাপ ৩" }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="lg:col-span-7 flex flex-col gap-4 flex-1">
        <div className="bento-card p-0 bg-white relative overflow-hidden aspect-video lg:aspect-auto lg:h-[600px] flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
             <MousePointer2 className="w-3 h-3" /> নির্দেশনা অনুযায়ী ধাপগুলো অনুসরণ করুন
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)} className={cn("h-2 rounded-full transition-all", step === i ? "bg-red-500 w-full" : "bg-gray-200")} />
          ))}
        </div>
      </div>
      <SidebarProof steps={steps} step={step} setStep={setStep} />
    </div>
  );
};

// --- Theorem 38 ---
const Theorem38: React.FC = () => {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Geometry Calculation strictly following the provided image
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // A and B on horizontal line
    const A = { x: cx - 60, y: cy - 20 };
    const B = { x: cx + 100, y: cy - 20 };
    const distAB = B.x - A.x;

    // Standard 3-4-5 ratio: AC=3, BC=4, AB=5
    const AC_len = (3/5) * distAB;
    const BC_len = (4/5) * distAB;
    
    // C position: A + projection of AC onto AB + height
    const projAC = (AC_len * AC_len) / distAB;
    const h = (AC_len * BC_len) / distAB;
    const C = { x: A.x + projAC, y: A.y - h };

    // Square ABED (extending down from AB)
    const D = { x: A.x, y: A.y + distAB };
    const E = { x: B.x, y: B.y + distAB };

    // Square ACGF (extending outward-left from AC)
    // Vector AC is (C.x - A.x, C.y - A.y)
    // Left Normal is (-(C.y - A.y), C.x - A.x)
    const nxAC = -(C.y - A.y) * (AC_len / AC_len);
    const nyAC = (C.x - A.x) * (AC_len / AC_len);
    // Actually simpler: rotation by -90 deg from A->C
    const angleAC = Math.atan2(C.y - A.y, C.x - A.x);
    const F = { x: A.x + AC_len * Math.cos(angleAC - Math.PI/2), y: A.y + AC_len * Math.sin(angleAC - Math.PI/2) };
    const G = { x: C.x + AC_len * Math.cos(angleAC - Math.PI/2), y: C.y + AC_len * Math.sin(angleAC - Math.PI/2) };

    // Square BCHK (extending outward-right from BC)
    const angleCB = Math.atan2(B.y - C.y, B.x - C.x);
    const H = { x: C.x + BC_len * Math.cos(angleCB - Math.PI/2), y: C.y + BC_len * Math.sin(angleCB - Math.PI/2) };
    const K = { x: B.x + BC_len * Math.cos(angleCB - Math.PI/2), y: B.y + BC_len * Math.sin(angleCB - Math.PI/2) };

    // Parallel Line CL through M
    const M = { x: C.x, y: A.y };
    const L = { x: C.x, y: D.y };

    const drawLine = (p1: Point, p2: Point, color = '#374151', width = 2, dash: number[] = []) => {
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.setLineDash(dash); ctx.stroke(); ctx.setLineDash([]);
    };

    const drawPoint = (p: Point, label: string, ox = -15, oy = -10) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fillStyle = '#111827'; ctx.fill();
      ctx.font = 'bold 16px sans-serif'; ctx.fillText(label, p.x + ox, p.y + oy);
    };

    // Draw base triangle
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath();
    ctx.strokeStyle = '#111827'; ctx.lineWidth = 3; ctx.stroke();

    if (step >= 1) {
      // Squares
      drawLine(A, F); drawLine(F, G); drawLine(G, C); // ACGF
      drawLine(C, H); drawLine(H, K); drawLine(K, B); // BCHK
      drawLine(A, D); drawLine(D, E); drawLine(E, B); // ABED
      
      // Parallel divider CL
      drawLine(C, L, '#9CA3AF', 1, [5, 5]);
      drawPoint(L, 'L', -5, 25); drawPoint(M, 'M', 10, 15);

      // Construction lines
      if (step >= 2) {
        drawLine(C, D, '#3B82F6', 1, [2, 2]);
        drawLine(B, F, '#3B82F6', 1, [2, 2]);
      }
    }

    // Highlighting
    if (step === 2) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.lineTo(A.x, A.y); ctx.lineTo(D.x, D.y); ctx.fill();
      ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(A.x, A.y); ctx.lineTo(F.x, F.y); ctx.fill();
    }
    if (step === 3) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(D.x, D.y); ctx.lineTo(L.x, L.y); ctx.lineTo(M.x, M.y); ctx.fill();
    }
    if (step === 4) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(C.x, C.y); ctx.lineTo(G.x, G.y); ctx.lineTo(F.x, F.y); ctx.fill();
    }

    drawPoint(A, 'A', -25, 5); drawPoint(B, 'B', 15, 5); drawPoint(C, 'C', -5, -15);
    if (step >= 1) {
      drawPoint(D, 'D', -25, 10); drawPoint(E, 'E', 15, 10);
      drawPoint(F, 'F', -25, 0); drawPoint(G, 'G', -10, -20);
      drawPoint(H, 'H', -5, -20); drawPoint(K, 'K', 15, 0);
    }

  }, [step]);

  const steps = [
    { title: "বিশেষ নির্বচন", content: "মনে করি, ABC সমকোণী ত্রিভুজের ∠ACB সমকোণ এবং AB অতিভুজ। প্রমাণ করতে হবে যে, AB² = BC² + AC²।", badge: "বিশেষ নির্বচন" },
    { title: "অঙ্কন", content: "AB, AC এবং BC বাহুর উপর যথাক্রমে ABED, ACGF এবং BCHK বর্গক্ষেত্র অঙ্কন করি। C বিন্দু দিয়ে AD বা BE রেখার সমান্তরাল CL রেখা আঁকি যা AB কে M এবং DE কে L বিন্দুতে ছেদ করে। C, D এবং B, F যোগ করি।", badge: "অঙ্কন" },
    { title: "প্রমাণ: ধাপ ১", content: "∆CAD ও ∆BAF তে CA = AF, AD = AB এবং অন্তর্ভুক্ত ∠CAD = অন্তর্ভুক্ত ∠BAF। ∴ ∆CAD ≅ ∆BAF।", badge: "ধাপ ১" },
    { title: "প্রমাণ: ধাপ ২", content: "∆CAD এবং আয়তক্ষেত্র ADLM একই ভূমি AD এর উপর এবং AD ও CL সমান্তরাল রেখাদ্বয়ের মধ্যে অবস্থিত। ∴ আয়তক্ষেত্র ADLM = 2 ∆CAD।", badge: "ধাপ ২" },
    { title: "প্রমাণ: ধাপ ৩", content: "∆BAF এবং বর্গক্ষেত্র ACGF একই ভূমি AF এর উপর এবং AF ও BG সমান্তরাল রেখাদ্বয়ের মধ্যে অবস্থিত। ∴ বর্গক্ষেত্র ACGF = 2 ∆FAB = 2 ∆CAD।", badge: "ধাপ ৩" },
    { title: "প্রমাণ: ধাপ ৪", content: "∴ আয়তক্ষেত্র ADLM = বর্গক্ষেত্র ACGF।", badge: "ধাপ ৪" },
    { title: "প্রমাণ: ধাপ ৫", content: "অনুরূপভাবে C, E ও A, K যোগ করে প্রমাণ করা যায় যে, আয়তক্ষেত্র BELM = বর্গক্ষেত্র BCHK।", badge: "ধাপ ৫" },
    { title: "প্রমাণ: ধাপ ৬", content: "আয়তক্ষেত্র (ADLM + BELM) = বর্গক্ষেত্র ACGF + বর্গক্ষেত্র BCHK।\n∴ বর্গক্ষেত্র ABED = বর্গক্ষেত্র ACGF + বর্গক্ষেত্র BCHK।\nঅর্থাৎ, AB² = BC² + AC²। (প্রমাণিত)", badge: "ধাপ ৬" }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="lg:col-span-7 flex flex-col gap-4 flex-1">
        <div className="bento-card p-0 bg-white relative overflow-hidden aspect-video lg:aspect-auto lg:h-[600px] flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
             <MousePointer2 className="w-3 h-3" /> নির্দেশনা অনুযায়ী ধাপগুলো অনুসরণ করুন
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)} className={cn("h-2 rounded-full transition-all", step === i ? "bg-red-500 w-full" : "bg-gray-200")} />
          ))}
        </div>
      </div>
      <SidebarProof steps={steps} step={step} setStep={setStep} />
    </div>
  );
};

// --- Main Component ---
interface GeometrySimProps {
  selectedChapter: number | null;
  setSelectedChapter: (chapter: number | null) => void;
  selectedTheorem: number | null;
  setSelectedTheorem: (theorem: number | null) => void;
}

const GeometrySim: React.FC<GeometrySimProps> = ({ 
  selectedChapter, 
  setSelectedChapter, 
  selectedTheorem, 
  setSelectedTheorem 
}) => {
  const chapters = [
    { 
      id: 6, 
      title: "অধ্যায় ৬ঃ রেখা, কোণ ও ত্রিভুজ", 
      theorems: [
        { id: 14, title: "উপপাদ্য ১৪", desc: "ত্রিভুজের যেকোনো দুই বাহুর মধ্যবিন্দুর সংযোজক রেখাংশ তৃতীয় বাহুর সমান্তরাল এবং দৈর্ঘ্য তার অর্ধেক।" }
      ]
    },
    {
      id: 8,
      title: "অধ্যায় ৮: বৃত্ত",
      theorems: [
        { id: 18, title: "উপপাদ্য ১৮", desc: "বৃত্তের সকল সমান জ্যা কেন্দ্র থেকে সমদূরবর্তী।" }
      ]
    },
    { 
      id: 14, 
      title: "অধ্যায় ১৪ঃ অনুপাত, সদৃশতা ও প্রতিসমতা", 
      theorems: [
        { id: 35, title: "উপপাদ্য ৩৫", desc: "দুইটি সদৃশ ত্রিভুজক্ষেত্রের ক্ষেত্রফলদ্বয়ের অনুপাত এদের যেকোনো দুই অনুরূপ বাহুর উপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফলদ্বয়ের অনুপাতের সমান।" }
      ]
    },
    { 
      id: 15, 
      title: "অধ্যায় ১৫ঃ ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য", 
      theorems: [
        { id: 38, title: "উপপাদ্য ৩৮", desc: "পিথাগোরাসের উপপাদ্য: সমকোণী ত্রিভুজের অতিভুজের উপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর উপর অঙ্কিত বর্গক্ষেত্রদ্বয়ের ক্ষেত্রফলের সমষ্টির সমান (AC^2 = AB^2 + BC^2)।" }
      ]
    }
  ];

  const currentChapter = chapters.find(c => c.id === selectedChapter);

  // Chapter Selection View
  if (selectedChapter === null) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-gray-800">জ্যামিতির সকল আলোচনা</h2>
          <p className="text-gray-500 font-medium font-sans uppercase tracking-widest text-xs">চ্যাপ্টার নির্বাচন করুন</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <motion.button
              key={chapter.id}
              id={`tour-chapter-${chapter.id}`}
              whileHover={{ scale: 1.02, translateY: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedChapter(chapter.id)}
              className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-red-500 text-left transition-all shadow-sm group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                  <BookOpen className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight group-hover:text-red-600 transition-colors">{chapter.title}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{chapter.theorems.length} টি উপপাদ্য উপলব্ধ</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Theorem Selection View (Inside a Chapter)
  if (selectedTheorem === null) {
    return (
      <div className="flex flex-col gap-8">
        <button 
          onClick={() => setSelectedChapter(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-colors w-fit group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          সকল অধ্যায়-এ ফিরে যান
        </button>

        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-gray-800">{currentChapter?.title}</h2>
          <p className="text-gray-500 font-medium font-sans uppercase tracking-widest text-xs">উপপাদ্য নির্বাচন করুন</p>
        </div>

        {currentChapter?.theorems.length === 0 ? (
          <div className="bento-card p-12 flex flex-col items-center justify-center text-center bg-white border-dashed border-2 border-gray-200">
            <div className="p-6 bg-gray-50 rounded-full mb-6">
               <Info className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">শীঘ্রই আসছে!</h3>
            <p className="text-gray-400 max-w-md">এই চ্যাপ্টার এর উপপাদ্যগুলো বর্তমানে তৈরি করা হচ্ছে। দয়া করে অপেক্ষা করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentChapter?.theorems.map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.02, translateY: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTheorem(t.id)}
                className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-red-500 text-left transition-all shadow-sm group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-500 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed"><MathText math={t.desc} /></p>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Active Theorem Simulation View
  return (
    <div className="flex flex-col gap-6">
      <button 
        onClick={() => setSelectedTheorem(null)}
        className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-colors w-fit group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        {currentChapter?.title}-এ ফিরে যান
      </button>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold whitespace-nowrap">
          উপপাদ্য {selectedTheorem === 14 ? '১৪' : selectedTheorem === 18 ? '১৮' : selectedTheorem === 35 ? '৩৫' : '৩৮'}
        </span>
        <p className="text-gray-700 font-bold text-base leading-snug">
          {currentChapter?.theorems.find(t => t.id === selectedTheorem)?.desc}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTheorem}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {selectedTheorem === 14 ? <Theorem14 /> : 
           selectedTheorem === 18 ? <Theorem18 /> : 
           selectedTheorem === 35 ? <Theorem35 /> : 
           <Theorem38 />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GeometrySim;
