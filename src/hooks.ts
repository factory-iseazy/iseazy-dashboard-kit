import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** Ancho real de un contenedor (ResizeObserver). Para gráficas SVG responsivas. */
export function useAncho<T extends HTMLElement = HTMLDivElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [ancho, setAncho] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setAncho(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([e]) => setAncho(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, ancho];
}

/** Estado de filtros reflejado en la URL (design system §13.7): cualquier vista es un enlace que se
    abre igual. Solo se escriben en la URL los valores distintos del por defecto; se usa
    `replaceState` para no llenar el historial con cada clic. */
export function useUrlState<T extends Record<string, string>>(
  defaults: T,
): [T, (cambios: Partial<T>) => void, () => void] {
  const leer = useCallback((): T => {
    const q = new URLSearchParams(window.location.search);
    const out = { ...defaults };
    for (const k of Object.keys(defaults) as (keyof T)[]) {
      const v = q.get(k as string);
      if (v != null) out[k] = v as T[keyof T];
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [estado, setEstado] = useState<T>(leer);

  useEffect(() => {
    const onPop = () => setEstado(leer());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [leer]);

  const escribir = useCallback(
    (nuevo: T) => {
      const q = new URLSearchParams(window.location.search);
      for (const k of Object.keys(defaults)) {
        if (nuevo[k] === defaults[k] || nuevo[k] === "") q.delete(k);
        else q.set(k, nuevo[k]);
      }
      const qs = q.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const set = useCallback(
    (cambios: Partial<T>) =>
      setEstado((prev) => {
        const nuevo = { ...prev, ...cambios };
        escribir(nuevo);
        return nuevo;
      }),
    [escribir],
  );

  const reset = useCallback(() => {
    escribir(defaults);
    setEstado(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escribir]);

  return [estado, set, reset];
}
