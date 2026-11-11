import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { fmtMes } from "./format";

export interface PresetMeses {
  id: string;
  label: string;
  /** devuelve los meses ('YYYY-MM') que selecciona el preset a partir de los disponibles */
  aplicar: (disponibles: string[]) => string[];
}

/** Selector de meses sueltos (periodos a mostrar): botón con el resumen de la selección que abre un
    panel con atajos (presets) y una rejilla de meses agrupada por año. Siempre queda al menos uno. */
export function SelectorMeses({
  disponibles,
  seleccion,
  onChange,
  presets = [],
  presetActivo,
  onPreset,
}: {
  disponibles: string[];
  seleccion: string[];
  onChange: (meses: string[]) => void;
  presets?: PresetMeses[];
  /** id del preset activo (si la selección viene de uno) */
  presetActivo?: string | null;
  onPreset?: (id: string, meses: string[]) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setAbierto(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [abierto]);

  const sel = new Set(seleccion);
  const ordenada = disponibles.filter((m) => sel.has(m));
  const resumen = !ordenada.length
    ? "Sin meses"
    : ordenada.length === 1
      ? fmtMes(ordenada[0])
      : `${ordenada.length} meses: ${fmtMes(ordenada[0])} – ${fmtMes(ordenada[ordenada.length - 1])}`;
  const anios = Array.from(new Set(disponibles.map((m) => m.slice(0, 4))));

  const toggle = (m: string) => {
    const next = sel.has(m) ? seleccion.filter((x) => x !== m) : [...seleccion, m];
    if (next.length) onChange(disponibles.filter((x) => next.includes(x)));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        className="inline-flex max-w-full items-center gap-2 rounded-lg border border-line bg-card px-3 py-1.5 text-[13px] font-medium text-ink-deep hover:border-line-strong"
      >
        <span className="truncate">{resumen}</span>
        <IconChevronDown size={15} stroke={1.75} className={`shrink-0 text-soft transition-transform ${abierto ? "rotate-180" : ""}`} />
      </button>
      {abierto && (
        <div className="absolute right-0 z-30 mt-1 w-[min(560px,92vw)] rounded-xl border border-line bg-card p-3 shadow-lg">
          {presets.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5 border-b border-line pb-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    const meses = p.aplicar(disponibles);
                    if (!meses.length) return;
                    onPreset ? onPreset(p.id, meses) : onChange(meses);
                  }}
                  aria-pressed={presetActivo === p.id}
                  className={`rounded-md border px-2 py-0.5 text-[11.5px] font-medium ${
                    presetActivo === p.id ? "border-brand bg-brand-soft text-brand" : "border-line text-subtle hover:bg-muted-2"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <div className="max-h-72 overflow-y-auto">
            {anios.map((a) => (
              <div key={a} className="mb-1 flex items-center gap-1">
                <span className="w-10 shrink-0 text-[11px] font-semibold text-soft">{a}</span>
                <div className="grid flex-1 grid-cols-6 gap-0.5 sm:grid-cols-12">
                  {disponibles
                    .filter((m) => m.startsWith(a))
                    .map((m) => {
                      const on = sel.has(m);
                      return (
                        <button
                          key={m}
                          onClick={() => toggle(m)}
                          aria-pressed={on}
                          title={fmtMes(m)}
                          className={`flex h-7 items-center justify-center gap-0.5 rounded-md text-[11px] ${
                            on ? "bg-brand-soft font-semibold text-brand" : "text-subtle hover:bg-muted-2"
                          }`}
                        >
                          {on && <IconCheck size={11} stroke={2.5} />}
                          {fmtMes(m).slice(0, 3)}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-soft">{ordenada.length} seleccionados · clic en un mes para quitarlo o añadirlo</p>
        </div>
      )}
    </div>
  );
}
