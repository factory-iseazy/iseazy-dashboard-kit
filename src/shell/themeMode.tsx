import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";

/* Modo claro/oscuro (design system §2.8 y §5.25): `class="dark"` en <html>, persistido en
   localStorage con la clave `iseazy-ds-theme`. Sin preferencia guardada, sigue al sistema.
   El script de index.html aplica la clase antes de que cargue React (sin parpadeo). */

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "iseazy-ds-theme";

function guardado(): ThemeMode | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

function delSistema(): ThemeMode {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface Ctx {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeModeCtx = createContext<Ctx | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => guardado() ?? delSistema());

  useLayoutEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.toggle("dark", mode === "dark");
    raiz.style.colorScheme = mode;
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((m) => {
      const siguiente: ThemeMode = m === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, siguiente);
      } catch {
        /* sin almacenamiento (modo privado): el cambio vale para esta sesión */
      }
      return siguiente;
    });
  }, []);

  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);
  return <ThemeModeCtx.Provider value={value}>{children}</ThemeModeCtx.Provider>;
}

export function useThemeMode(): Ctx {
  const ctx = useContext(ThemeModeCtx);
  if (!ctx) throw new Error("useThemeMode fuera de ThemeModeProvider");
  return ctx;
}
