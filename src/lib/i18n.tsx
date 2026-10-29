"use client";

import { useEffect, useSyncExternalStore } from "react";

export type Lang = "tr" | "en";

// Language lives in localStorage; this tiny store lets every component
// subscribe to it without a provider and stays hydration-safe.
const listeners = new Set<() => void>();

function read(): Lang {
  try {
    return localStorage.getItem("lang") === "en" ? "en" : "tr";
  } catch {
    return "tr";
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function setLang(l: Lang) {
  try {
    localStorage.setItem("lang", l);
  } catch {}
  listeners.forEach((cb) => cb());
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, read, () => "tr" as Lang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return children;
}

export function useLang() {
  const lang = useSyncExternalStore(subscribe, read, () => "tr" as Lang);
  const t = (tr: string, en: string) => (lang === "en" ? en : tr);
  return { lang, setLang, t };
}
