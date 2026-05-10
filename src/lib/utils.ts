import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SPECIAL_ANGLES = [
  0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360
];

export function getSpecialLabel(deg: number): { sin: string, cos: string, tan: string, rad: string, sinRaw: string, cosRaw: string, tanRaw: string, radRaw: string } | null {
  const d = ((deg % 360) + 360) % 360;
  
  const labels: Record<number, { sin: string, cos: string, tan: string, rad: string, sinRaw: string, cosRaw: string, tanRaw: string, radRaw: string }> = {
    0: { cos: "1", sin: "0", tan: "0", rad: "0", cosRaw: "1", sinRaw: "0", tanRaw: "0", radRaw: "0" },
    30: { cos: "\\frac{\\sqrt{3}}{2}", sin: "\\frac{1}{2}", tan: "\\frac{1}{\\sqrt{3}}", rad: "\\frac{\\pi}{6}", cosRaw: "√3/2", sinRaw: "1/2", tanRaw: "1/√3", radRaw: "π/6" },
    45: { cos: "\\frac{1}{\\sqrt{2}}", sin: "\\frac{1}{\\sqrt{2}}", tan: "1", rad: "\\frac{\\pi}{4}", cosRaw: "1/√2", sinRaw: "1/√2", tanRaw: "1", radRaw: "π/4" },
    60: { cos: "\\frac{1}{2}", sin: "\\frac{\\sqrt{3}}{2}", tan: "\\sqrt{3}", rad: "\\frac{\\pi}{3}", cosRaw: "1/2", sinRaw: "√3/2", tanRaw: "√3", radRaw: "π/3" },
    90: { cos: "0", sin: "1", tan: "\\infty", rad: "\\frac{\\pi}{2}", cosRaw: "0", sinRaw: "1", tanRaw: "∞", radRaw: "π/2" },
    120: { cos: "-\\frac{1}{2}", sin: "\\frac{\\sqrt{3}}{2}", tan: "-\\sqrt{3}", rad: "\\frac{2\\pi}{3}", cosRaw: "-1/2", sinRaw: "√3/2", tanRaw: "-√3", radRaw: "2π/3" },
    135: { cos: "-\\frac{1}{\\sqrt{2}}", sin: "\\frac{1}{\\sqrt{2}}", tan: "-1", rad: "\\frac{3\\pi}{4}", cosRaw: "-1/√2", sinRaw: "1/√2", tanRaw: "-1", radRaw: "3π/4" },
    150: { cos: "-\\frac{\\sqrt{3}}{2}", sin: "\\frac{1}{2}", tan: "-\\frac{1}{\\sqrt{3}}", rad: "\\frac{5\\pi}{6}", cosRaw: "-√3/2", sinRaw: "1/2", tanRaw: "-1/√3", radRaw: "5π/6" },
    180: { cos: "-1", sin: "0", tan: "0", rad: "\\pi", cosRaw: "-1", sinRaw: "0", tanRaw: "0", radRaw: "π" },
    210: { cos: "-\\frac{\\sqrt{3}}{2}", sin: "-\\frac{1}{2}", tan: "\\frac{1}{\\sqrt{3}}", rad: "\\frac{7\\pi}{6}", cosRaw: "-√3/2", sinRaw: "-1/2", tanRaw: "1/√3", radRaw: "7π/6" },
    225: { cos: "-\\frac{1}{\\sqrt{2}}", sin: "-\\frac{1}{\\sqrt{2}}", tan: "1", rad: "\\frac{5\\pi}{4}", cosRaw: "-1/√2", sinRaw: "-1/√2", tanRaw: "1", radRaw: "5π/4" },
    240: { cos: "-\\frac{1}{2}", sin: "-\\frac{\\sqrt{3}}{2}", tan: "\\sqrt{3}", rad: "\\frac{4\\pi}{3}", cosRaw: "-1/2", sinRaw: "-√3/2", tanRaw: "√3", radRaw: "4π/3" },
    270: { cos: "0", sin: "-1", tan: "\\infty", rad: "\\frac{3\\pi}{2}", cosRaw: "0", sinRaw: "-1", tanRaw: "∞", radRaw: "3π/2" },
    300: { cos: "\\frac{1}{2}", sin: "-\\frac{\\sqrt{3}}{2}", tan: "-\\sqrt{3}", rad: "\\frac{5\\pi}{3}", cosRaw: "1/2", sinRaw: "-√3/2", tanRaw: "-√3", radRaw: "5π/3" },
    315: { cos: "\\frac{1}{\\sqrt{2}}", sin: "-\\frac{1}{\\sqrt{2}}", tan: "-1", rad: "\\frac{7\\pi}{4}", cosRaw: "1/√2", sinRaw: "-1/√2", tanRaw: "-1", radRaw: "7π/4" },
    330: { cos: "\\frac{\\sqrt{3}}{2}", sin: "-\\frac{1}{2}", tan: "-\\frac{1}{\\sqrt{3}}", rad: "\\frac{11\\pi}{6}", cosRaw: "√3/2", sinRaw: "-1/2", tanRaw: "-1/√3", radRaw: "11π/6" },
    360: { cos: "1", sin: "0", tan: "0", rad: "2\\pi", cosRaw: "1", sinRaw: "0", tanRaw: "0", radRaw: "2π" }
  };

  // Find if we are close to a special angle
  const snapped = SPECIAL_ANGLES.find(a => Math.abs(d - a) < 0.1);
  return snapped !== undefined ? labels[snapped] : null;
}

export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
}
