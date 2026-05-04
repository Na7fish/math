import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SPECIAL_ANGLES = [
  0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360
];

export function getSpecialLabel(deg: number): { sin: string, cos: string } | null {
  const d = ((deg % 360) + 360) % 360;
  
  const labels: Record<number, { sin: string, cos: string }> = {
    0: { cos: "1", sin: "0" },
    30: { cos: "√3/2", sin: "1/2" },
    45: { cos: "√2/2", sin: "√2/2" },
    60: { cos: "1/2", sin: "√3/2" },
    90: { cos: "0", sin: "1" },
    120: { cos: "-1/2", sin: "√3/2" },
    135: { cos: "-√2/2", sin: "√2/2" },
    150: { cos: "-√3/2", sin: "1/2" },
    180: { cos: "-1", sin: "0" },
    210: { cos: "-√3/2", sin: "-1/2" },
    225: { cos: "-√2/2", sin: "-√2/2" },
    240: { cos: "-1/2", sin: "-√3/2" },
    270: { cos: "0", sin: "-1" },
    300: { cos: "1/2", sin: "-√3/2" },
    315: { cos: "√2/2", sin: "-√2/2" },
    330: { cos: "√3/2", sin: "-1/2" },
    360: { cos: "1", sin: "0" }
  };

  // Find if we are close to a special angle
  const snapped = SPECIAL_ANGLES.find(a => Math.abs(d - a) < 0.1);
  return snapped !== undefined ? labels[snapped] : null;
}

export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
}
