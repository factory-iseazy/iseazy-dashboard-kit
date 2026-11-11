import { useState } from "react";
import { fmtCompact } from "../format";
import { useAncho } from "../hooks";
import { STATUS, useChartChrome } from "../theme";
import { marcasY } from "./escala";

export interface PasoCascada {
  etiqueta: string;
  /** en un paso, la variación (con signo); en un total, el valor absoluto */
  valor: number;
  tipo: "total" | "paso";
  /** color de los totales (por defecto, la tinta); los pasos van en verde/rojo por signo */
  color?: string;
  /** línea secundaria bajo la etiqueta (p. ej. "88 cuentas × línea") */
  detalle?: string;
}

/** Cascada (waterfall): totales desde cero y pasos flotantes que suman de uno al siguiente, con el
    valor encima de cada barra y verde/rojo por signo (§13.5). Clic en una barra opcional. */
export function BarrasCascada({
  pasos,
  formato = fmtCompact,
  height = 320,
  onClick,
  colorTotal,
}: {
  pasos: PasoCascada[];
  formato?: (v: number) => string;
  height?: number;
  onClick?: (indice: number) => void;
  colorTotal?: string;
}) {
  const c = useChartChrome();
  const [ref, ancho] = useAncho();
  const [hover, setHover] = useState<number | null>(null);
  const m = { top: 28, right: 8, bottom: 44, left: 52 };
  const w = Math.max(0, ancho - m.left - m.right);
  const h = height - m.top - m.bottom;

  // niveles acumulados
  let acum = 0;
  const niveles = pasos.map((p) => {
    if (p.tipo === "total") {
      acum = p.valor;
      return { y0: 0, y1: p.valor };
    }
    const y0 = acum;
    acum += p.valor;
    return { y0, y1: acum };
  });
  const maxV = Math.max(1, ...niveles.flatMap((n) => [n.y0, n.y1]));
  const { max, marcas } = marcasY(maxV, 4);
  const banda = pasos.length ? w / pasos.length : 0;
  const ancBarra = Math.min(64, banda * 0.6);
  const y = (v: number) => h - (v / max) * h;

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height }}>
      {ancho > 0 && (
        <svg width={ancho} height={height} role="img" aria-label="Cascada de variación">
          <g transform={`translate(${m.left},${m.top})`}>
            {marcas.map((t) => (
              <g key={t} transform={`translate(0,${y(t)})`}>
                <line x1={0} x2={w} stroke={c.grid} />
                <text x={-8} dy="0.32em" textAnchor="end" fontSize={11} fill={c.axisText} className="tnum">
                  {formato(t)}
                </text>
              </g>
            ))}
            {pasos.map((p, i) => {
              const n = niveles[i];
              const cx = banda * i + banda / 2;
              const top = y(Math.max(n.y0, n.y1));
              const bottom = y(Math.min(n.y0, n.y1));
              const color = p.tipo === "total" ? p.color ?? colorTotal ?? c.ink : p.valor >= 0 ? STATUS.positivo : STATUS.negativo;
              const activa = hover === i;
              const alto = Math.max(p.tipo === "paso" && p.valor !== 0 ? 2 : 0, bottom - top);
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onClick?.(i)}
                  style={{ cursor: onClick ? "pointer" : "default" }}
                >
                  <rect x={banda * i} y={0} width={banda} height={h + m.bottom} fill="transparent" />
                  {i > 0 && (
                    <line
                      x1={banda * (i - 1) + banda / 2 + ancBarra / 2}
                      x2={cx - ancBarra / 2}
                      y1={y(n.y0 === 0 && p.tipo === "total" ? niveles[i - 1].y1 : n.y0)}
                      y2={y(n.y0 === 0 && p.tipo === "total" ? niveles[i - 1].y1 : n.y0)}
                      stroke={c.subtle}
                      strokeOpacity={0.35}
                      strokeDasharray="3 3"
                    />
                  )}
                  <rect x={cx - ancBarra / 2} y={top} width={ancBarra} height={alto} rx={3} fill={color} opacity={activa ? 1 : p.tipo === "total" ? 0.9 : 0.85} />
                  <text x={cx} y={top - 7} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={c.ink} className="tnum">
                    {p.tipo === "paso" ? `${p.valor > 0 ? "+" : p.valor < 0 ? "−" : ""}${formato(Math.abs(p.valor))}` : formato(p.valor)}
                  </text>
                  <text x={cx} y={h + 16} textAnchor="middle" fontSize={11} fontWeight={p.tipo === "total" ? 600 : 400} fill={p.tipo === "total" ? c.ink : c.axisText}>
                    {p.etiqueta}
                  </text>
                  {p.detalle && (
                    <text x={cx} y={h + 30} textAnchor="middle" fontSize={10} fill={c.axisText}>
                      {p.detalle}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}
