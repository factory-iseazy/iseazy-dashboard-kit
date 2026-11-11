import { useState } from "react";
import { fmtCompact, fmtDelta } from "../format";
import { useAncho } from "../hooks";
import { SERIES, STATUS, useChartChrome } from "../theme";
import { marcasY } from "./escala";

export interface BarraHito {
  etiqueta: string;
  valor: number;
  /** la barra protagonista (p. ej. el corte actual); el resto va atenuado */
  destacada?: boolean;
  detalle?: string;
}

/** Columnas de hitos (cierres de año, trimestres…) con el valor encima y la VARIACIÓN entre cada
    par de barras rotulada en una píldora (verde/roja por signo, §13.5). Una sola serie y un solo
    color: la protagonista sólida y el resto del mismo tono atenuado. */
export function BarrasVariacion({
  barras,
  formato = fmtCompact,
  formatoValor,
  color = SERIES[0],
  height = 300,
  onClick,
}: {
  barras: BarraHito[];
  formato?: (v: number) => string;
  formatoValor?: (v: number) => string;
  color?: string;
  height?: number;
  onClick?: (indice: number) => void;
}) {
  const c = useChartChrome();
  const [ref, ancho] = useAncho();
  const [hover, setHover] = useState<number | null>(null);
  const m = { top: 30, right: 8, bottom: 48, left: 8 };
  const w = Math.max(0, ancho - m.left - m.right);
  const h = height - m.top - m.bottom;
  const { max } = marcasY(Math.max(1, ...barras.map((b) => b.valor)), 4);
  const banda = barras.length ? w / barras.length : 0;
  const ancBarra = Math.min(56, banda * 0.56);
  const y = (v: number) => h - (Math.max(0, v) / max) * h;

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height }}>
      {ancho > 0 && (
        <svg width={ancho} height={height} role="img" aria-label="Valor de cada hito y variación entre hitos">
          <g transform={`translate(${m.left},${m.top})`}>
            <line x1={0} x2={w} y1={h} y2={h} stroke={c.grid} />
            {barras.map((b, i) => {
              const cx = banda * i + banda / 2;
              const top = y(b.valor);
              const prev = barras[i - 1];
              const d = prev && prev.valor ? (b.valor - prev.valor) / prev.valor : null;
              const activa = hover === i;
              return (
                <g
                  key={b.etiqueta}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onClick?.(i)}
                  style={{ cursor: onClick ? "pointer" : "default" }}
                >
                  <rect x={banda * i} y={0} width={banda} height={h + m.bottom} fill="transparent" />
                  <rect
                    x={cx - ancBarra / 2}
                    y={top}
                    width={ancBarra}
                    height={Math.max(0, h - top)}
                    rx={4}
                    fill={color}
                    opacity={b.destacada ? 1 : activa ? 0.6 : 0.32}
                  />
                  <text x={cx} y={top - 8} textAnchor="middle" fontSize={12} fontWeight={600} fill={c.ink} className="tnum">
                    {(formatoValor ?? formato)(b.valor)}
                  </text>
                  <text x={cx} y={h + 17} textAnchor="middle" fontSize={11} fill={b.destacada ? c.ink : c.axisText} fontWeight={b.destacada ? 600 : 400}>
                    {b.etiqueta}
                  </text>
                  {d != null && (
                    <g transform={`translate(${cx},${h + 36})`}>
                      <rect x={-24} y={-9} width={48} height={18} rx={9} fill={d >= 0 ? STATUS.positivo : STATUS.negativo} opacity={0.14} />
                      <text textAnchor="middle" dy="0.35em" fontSize={10.5} fontWeight={600} fill={d >= 0 ? STATUS.positivo : STATUS.negativo} className="tnum">
                        {fmtDelta(d, 1)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      )}
      {hover != null && barras[hover]?.detalle && (
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-md border border-line bg-card px-2 py-1 text-[11px] text-subtle shadow-sm">
          {barras[hover].detalle}
        </div>
      )}
    </div>
  );
}
