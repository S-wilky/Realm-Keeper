import { useState, useEffect } from "react";

// Define breakpoints (can be customized)
const breakpoints = {
xs: 0,
sm: 640,
md: 768,
lg: 1024,
xl: 1280,
"2xl": 1536,
};

// Helper: determine size label from width
const getSizeLabel = (width) => {
if (width >= breakpoints["2xl"]) return "2xl";
if (width >= breakpoints.xl) return "xl";
if (width >= breakpoints.lg) return "lg";
if (width >= breakpoints.md) return "md";
if (width >= breakpoints.sm) return "sm";
return "xs";
};

/**
 * Custom hook to get the current screen size category and width.
 * Supports Tailwind-style breakpoints: xs, sm, md, lg, xl, 2xl.
 */
export default function useScreenSize() {

  const [screenSize, setScreenSize] = useState({
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    innerScreenWidth: typeof window !== "undefined" ? 0 : 0,
    screenSizeLabel: typeof window !== "undefined" ? getSizeLabel(window.innerWidth) : "xs",
  });

  useEffect(() => {
    const handleResize = () => {
        // Create a temporary element with scrollbars
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll'; // Force scrollbars
        outer.style.msOverflowStyle = 'scrollbar'; // For IE 11
        outer.style.width = '100px';
        document.body.appendChild(outer);

        // Create an inner element and append it
        const inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);

        // Calculate the difference
        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

        // Clean up
        outer.parentNode.removeChild(outer);

        const screenWidth = window.innerWidth;
        const innerScreenWidth = (screenWidth - scrollbarWidth - 100);
        setScreenSize({ screenWidth, innerScreenWidth, screenSizeLabel: getSizeLabel(screenWidth) });
    };

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}
