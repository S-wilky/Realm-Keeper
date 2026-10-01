import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const THEMES = ["dark", "light", "dragon" /*, 'parchment'*/] as const;
export type ThemeName = (typeof THEMES)[number];

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
};

// 1. The channel (null until a Provider supplies a value)
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Start from whatever the index.html script already applied (see step 4)
function getInitialTheme(): ThemeName {
  const current = document.documentElement.dataset.theme as ThemeName;
  return THEMES.includes(current) ? current : "dark";
}

// 2. The Provider: owns the state and shares it
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  // Whenever the theme changes, update the page and save it
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. The hook components actually call
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
