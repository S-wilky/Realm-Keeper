// Convert a hex color (#RRGGBB or #RGB) into RGB
export function hexToRgb(hex) {
  hex = hex.replace('#', '');

  // Handle short form #abc
  if (hex.length === 3) {
    hex = hex.split('').map(h => h + h).join('');
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

// Convert RGB to HSL
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0));
        break;
      case g:
        h = ((b - r) / d + 2);
        break;
      case b:
        h = ((r - g) / d + 4);
        break;
    }

    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Combine into a single helper
export function hexToTailwindColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);

  return {
    "rgbClass": `bg-[rgb(${r},${g},${b})]`,
    "hslClass": `bg-[hsl(${hsl.h},${hsl.s}%,${hsl.l}%)]`,
    "rgb": { "r": r, "g": g, "b": b },
    "hsl": { "h": hsl.h, "s": hsl.s, "l": hsl.l }
  };
}

// Example usage:
if (process.argv[2]) {
  const hex = process.argv[2];
  console.log(hexToTailwindColor(hex));
}
