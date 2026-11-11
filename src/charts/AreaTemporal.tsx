import { useId, useMemo, useState } from "react";
import { fmtCompact, fmtDelta, fmtMes } from "../format";
import { useAncho } from "../hooks";
import { SERIES, STATUS, useChartChrome } from "../theme";
import { marcasY, mesTexto, pasoBonito, pathArea, pathLinea } from "./escala";

export interface SerieArea {
  id: string;
  label: string;
  /** misma longitud que `meses`; null = sin dato (hueco) */
  valores: (number | null)[];
  color?: string;
  /** serie de contexto (año anterior…): gris recesivo, discontinua y sin área (§13.3) */
  comparacion?: boolean;
}

/** Forma "serie temporal" (§13.4) en SVG propio: línea 2px, área con degradado solo si hay UNA serie
    protagonista, comparación en gris discontinua, crosshair con tooltip único (todas las series de esa
    X y la variación frente a la comparación), etiqueta del último valor y clic en un punto. */
export function AreaTemporal({
  meses,
  series,
  formato,
  formatoEje = fmtCompact,
  height = 320,
  onPunto,
  etiquetaFinal = true,
  etiquetaUltimoMes,
  ariaLabel,
  desdeCero = true,
  sombrearEntre,
}: {
  meses: string[];
  series: SerieArea[];
  formato: (v: number) => string;
  formatoEje?: (v: number) => string;
  height?: number;
  /** clic en un mes (p. ej. abrir el detalle de esa fecha) */
  onPunto?: (indice: number) => void;
  etiquetaFinal?: boolean;
  /** texto del último punto en el tooltip si no es un fin de mes (p. ej. "a 5 oct 2026") */
  etiquetaUltimoMes?: string;
  ariaLabel?: string;
  /** false = el eje empieza en el mínimo de los datos (ratios como el NRR); se declara en la descripción */
  desdeCero?: boolean;
  /** sombrea el hueco entre dos series (ids): para ver si una diferencia se abre o se cierra */
  sombrearEntre?: [string, string];
}) {
  const c = useChartChrome();
  const gid = useId().replace(/:/g, "");
  const [ref, ancho] = useAncho();
  const [hover, setHover] = useState<number | null>(null);

  const principales = series.filter((s) => !s.comparacion);
  const comp = series.find((s) => s.comparacion);
  const conArea = principales.length === 1;
  const colorDe = (s: SerieArea, i: number) => (s.comparacion ? c.deemphasis : s.color ?? SERIES[i % SERIES.length]);

  const m = { top: 14, right: etiquetaFinal ? 70 : 16, bottom: 26, left: 48 };
  const w = Math.max(0, ancho - m.left - m.right);
  const h = height - m.top - m.bottom;
  const n = meses.length;

  const { max, min, marcas } = useMemo(() => {
    const todos = series.flatMap((s) => s.valores.filter((v): v is number => v != null));
    if (desdeCero || !todos.length) return { ...marcasY(Math.max(0, ...todos)), min: 0 };
    const lo = Math.min(...todos), hi = Math.max(...todos);
    const paso = pasoBonito(Math.max(hi - lo, 1e-9), 4);
    const base = Math.floor(lo / paso) * paso;
    const tope = Math.max(base + paso, Math.ceil(hi / paso) * paso);
    const ms: number[] = [];
    for (let v = base; v <= tope + paso / 2; v += paso) ms.push(v);
    return { max: tope, min: base, marcas: ms };
  }, [series, desdeCero]);

  const x = (i: number) => (n <= 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v: number) => h - ((v - min) / (max - min || 1)) * h;
  const puntos = (s: SerieArea) => s.valores.map((v, i) => (v == null ? null : { x: x(i), y: y(v) }));

  // eje X: años si el rango es largo, meses si es corto
  const etiquetasX = useMemo(() => {
    if (n > 24) return meses.map((mm, i) => (mm.endsWith("-01") ? { i, t: mm.slice(0, 4) } : null)).filter(Boolean) as { i: number; t: string }[];
    const cada = Math.max(1, Math.ceil(n / 8));
    return meses.map((mm, i) => (i % cada === 0 ? { i, t: fmtMes(mm) } : null)).filter(Boolean) as { i: number; t: string }[];
  }, [meses, n]);

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    setHover(Math.min(n - 1, Math.max(0, Math.round((px / Math.max(1, w)) * (n - 1)))));
  };

  const ultimo = n - 1;
  const p0 = principales[0];
  const vUltimo = p0?.valores[ultimo];

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height }}>
      {ancho > 0 && (
        <svg width={ancho} height={height} role="img" aria-label={ariaLabel} className="overflow-visible">
          <defs>
            <linearGradient id={`g${gid}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={p0 ? colorDe(p0, 0) : SERIES[0]} stopOpacity={0.22} />
              <stop offset="100%" stopColor={p0 ? colorDe(p0, 0) : SERIES[0]} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <g transform={`translate(${m.left},${m.top})`}>
            {marcas.map((t) => (
              <g key={t} transform={`translate(0,${y(t)})`}>
                <line x1={0} x2={w} stroke={c.grid} strokeWidth={1} />
                <text x={-8} dy="0.32em" textAnchor="end" fontSize={11} fill={c.axisText} className="tnum">
                  {formatoEje(t)}
                </text>
              </g>
            ))}
            {etiquetasX.map(({ i, t }) => (
              <text key={i} x={x(i)} y={h + 18} textAnchor="middle" fontSize={11} fill={c.axisText}>
                {t}
              </text>
            ))}

            {comp && (
              <path d={pathLinea(puntos(comp))} fill="none" stroke={c.deemphasis} strokeWidth={1.5} strokeDasharray="4 4" strokeLinejoin="round" />
            )}
            {conArea && p0 && <path d={pathArea(puntos(p0), h)} fill={`url(#g${gid})`} />}
            {sombrearEntre && (() => {
              const a = series.find((s) => s.id === sombrearEntre[0]);
              const b = series.find((s) => s.id === sombrearEntre[1]);
              if (!a || !b) return null;
              const pa = puntos(a).filter((q): q is { x: number; y: number } => !!q);
              const pb = puntos(b).filter((q): q is { x: number; y: number } => !!q).reverse();
              if (pa.length < 2 || pb.length < 2) return null;
              const d = [...pa, ...pb].map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)},${q.y.toFixed(1)}`).join("") + "Z";
              return <path d={d} fill={colorDe(a, series.indexOf(a))} fillOpacity={0.14} />;
            })()}
            {principales.map((s, i) => (
              <path key={s.id} d={pathLinea(puntos(s))} fill="none" stroke={colorDe(s, i)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            ))}

            {/* último valor */}
            {p0 && vUltimo != null && (
              <g transform={`translate(${x(ultimo)},${y(vUltimo)})`}>
                <circle r={4.5} fill={colorDe(p0, 0)} stroke={c.surface} strokeWidth={2} />
                {etiquetaFinal && (
                  <text x={9} dy="0.32em" fontSize={12} fontWeight={600} fill={c.ink} className="tnum">
                    {formatoEje(vUltimo)}
                  </text>
                )}
              </g>
            )}

            {/* crosshair */}
            {hover != null && (
              <g pointerEvents="none">
                <line x1={x(hover)} x2={x(hover)} y1={0} y2={h} stroke={c.subtle} strokeOpacity={0.35} />
                {series.map((s, i) => {
                  const v = s.valores[hover];
                  return v == null ? null : (
                    <circle key={s.id} cx={x(hover)} cy={y(v)} r={3.5} fill={colorDe(s, i)} stroke={c.surface} strokeWidth={1.5} />
                  );
                })}
              </g>
            )}
            <rect
              width={w}
              height={h}
              fill="transparent"
              onMouseMove={onMove}
              onMouseLeave={() => setHover(null)}
              onClick={() => hover != null && onPunto?.(hover)}
              style={{ cursor: onPunto ? "pointer" : "crosshair" }}
            />
          </g>
        </svg>
      )}

      {hover != null && (
        <div
          className="pointer-events-none absolute z-10 min-w-44 rounded-lg border border-line bg-card px-3 py-2 shadow-md"
          style={{
            top: m.top + 4,
            left: m.left + x(hover) + (x(hover) > w - 200 ? -12 : 12),
            transform: x(hover) > w - 200 ? "translateX(-100%)" : undefined,
          }}
        >
          <div className="mb-1 text-[11px] font-medium text-soft">
            {hover === ultimo && etiquetaUltimoMes ? etiquetaUltimoMes : mesTexto(meses[hover])}
          </div>
          {series.map((s, i) => {
            const v = s.valores[hover];
            return (
              <div key={s.id} className="flex items-center gap-2 py-0.5">
                <span
                  aria-hidden
                  className="inline-block h-0.5 w-3.5 rounded"
                  style={{ background: colorDe(s, i), opacity: s.comparacion ? 0.9 : 1 }}
                />
                <span className="tnum text-sm font-semibold text-ink">{v == null ? "—" : formato(v)}</span>
                <span className="text-xs text-soft">{s.label}</span>
              </div>
            );
          })}
          {comp && principales.length === 1 && (() => {
            const a = p0.valores[hover];
            const b = comp.valores[hover];
            if (a == null || !b) return null;
            const d = (a - b) / b;
            return (
              <div className="mt-1 border-t border-line pt-1 text-xs font-semibold tnum" style={{ color: d >= 0 ? STATUS.positivo : STATUS.negativo }}>
                {fmtDelta(d, 1)} <span className="font-normal text-soft">frente a {comp.label.toLowerCase()}</span>
              </div>
            );
          })()}
          {onPunto && <div className="mt-1 text-[11px] text-soft">Clic para ver las líneas</div>}
        </div>
      )}
    </div>
  );
}
