type RGB = {
    r: number;
    g: number;
    b: number;
};

type HSL = {
    h: number;
    s: number;
    l: number;
};

type TailwindColor = {
    rgbClass: string;
    hslClass: string;
    rgb: RGB;
    hsl: HSL;
};

// Convert a hex color (#RRGGBB or #RGB) into RGB
export function hexToRgb(hex: string): RGB {
    hex = hex.replace("#", "");

    // Handle short form #abc
    if (hex.length === 3) {
        hex = hex
            .split("")
            .map((h) => h + h)
            .join("");
    }

    const bigint = parseInt(hex, 16);

    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

// Convert RGB to HSL
export function rgbToHsl(
    r: number,
    g: number,
    b: number
): HSL {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;

        s =
            l > 0.5
                ? d / (2 - max - min)
                : d / (max + min);

        switch (max) {
            case r:
                h =
                    (g - b) / d +
                    (g < b ? 6 : 0);
                break;

            case g:
                h = (b - r) / d + 2;
                break;

            case b:
                h = (r - g) / d + 4;
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
export function hexToTailwindColor(
    hex: string
): TailwindColor {
    const { r, g, b } = hexToRgb(hex);
    const hsl = rgbToHsl(r, g, b);

    return {
        rgbClass: `bg-[rgb(${r},${g}.${b})]`,
        hslClass: `bg-[hsl(${hsl.h},${hsl.s}%,${hsl.l}%)]`,
        rgb: { r, g, b },
        hsl: {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
        },
    };
}

// Example usage:
if (process.argv[2]) {
    const hex = process.argv[2];
    console.log(hexToTailwindColor(hex));
}