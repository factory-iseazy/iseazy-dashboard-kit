import { fmtDelta } from "../format";
import { DEEMPHASIS, STATUS } from "../theme";

export interface FilaRanking {
  clave: string;
  label: string;
  valor: number;
  delta?: number | null;
  color: string;
  activo?: boolean; // seleccionada por cross-filter
}

/** Forma "ranking" del kit: barras horizontales finas (≤24px), extremo de dato
    redondeado, valor en la punta y Δ coloreado por signo. Clic = cross-filter
    (la selección atenúa el resto a gris recesivo). */
export function RankingBars({
  filas,
  formato,
  onClick,
  haySeleccion = false,
  anchoLabel = 110,
}: {
  filas: FilaRanking[];
  formato: (v: number) => string;
  onClick?: (clave: string) => void;
  haySeleccion?: boolean;
  anchoLabel?: number;
}) {
  if (!filas.length) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;
  const max = Math.max(...filas.map((f) => f.valor), 1);
  return (
    <div className="flex flex-col gap-1">
      {filas.map((f) => {
        const atenuada = haySeleccion && !f.activo;
        return (
          <button
            key={f.clave}
            onClick={onClick ? () => onClick(f.clave) : undefined}
            disabled={!onClick}
            aria-pressed={f.activo}
            style={{ gridTemplateColumns: `${anchoLabel}px 1fr` }}
            className={`group grid items-center gap-2 rounded-md px-1 py-0.5 text-left ${
              onClick ? "cursor-pointer hover:bg-muted-2" : "cursor-default"
            }`}
            title={`${f.label}: ${formato(f.valor)}`}
          >
            <span className={`truncate text-xs ${f.activo ? "font-semibold text-ink-deep" : "text-subtle"}`}>
              {f.label}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-[18px] shrink-0 rounded-r-[4px] transition-[width,background-color] duration-200"
                style={{
                  width: `max(${((f.valor / max) * 62).toFixed(2)}%, 3px)`,
                  background: atenuada ? DEEMPHASIS : f.color,
                }}
              />
              <span className="tnum whitespace-nowrap text-xs font-semibold text-ink">{formato(f.valor)}</span>
              {f.delta !== undefined && f.delta !== null && (
                <span
                  className="tnum whitespace-nowrap text-[11px] font-semibold"
                  style={{ color: f.delta >= 0 ? STATUS.positivo : STATUS.negativo }}
                >
                  {fmtDelta(f.delta)}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
