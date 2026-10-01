import { THEMES, useTheme, type ThemeName } from "../styles/ThemeContext";

// Display names for each theme. Because this is a Record<ThemeName, string>,
// TypeScript will error here if you add a theme to THEMES and forget its label.
const LABELS: Record<ThemeName, string> = {
  dark: "Dark",
  light: "Light",
  dragon: "Dragon",
  //   parchment: 'Parchment',
};

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex gap-1 rounded-lg border border-border bg-surface-raised p-1"
    >
      {THEMES.map((t) => {
        const selected = t === theme;

        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(t)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
              selected
                ? "bg-primary/15 text-t-primary ring-1 ring-primary"
                : "text-t-muted hover:bg-surface hover:text-t-primary"
            }`}
          >
            {/* Swatch: data-theme on this span makes everything inside it use
                that theme's colors, so each button previews its own theme. */}
            <span
              data-theme={t}
              aria-hidden="true"
              className="flex h-4 w-6 overflow-hidden rounded-sm border border-border"
            >
              <span className="w-1/2 bg-surface" />
              <span className="w-1/2 bg-accent" />
            </span>
            {LABELS[t]}
          </button>
        );
      })}
    </div>
  );
}
