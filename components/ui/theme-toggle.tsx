"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Cambiar tema"
        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
      >
        …
      </button>
    );
  }

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-brand-400 hover:text-white"
      aria-label={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"}
    >
      {theme === "dark" ? "🌙" : "☀️"} {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
