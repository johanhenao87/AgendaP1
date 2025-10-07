"use client";

import { useLanguage } from "@/components/providers";
import { languages } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs text-slate-200">
      {languages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          className={`rounded-full px-2 py-1 transition ${
            item === language ? "bg-brand-500 text-white" : "text-slate-300 hover:text-white"
          }`}
          aria-pressed={item === language}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
