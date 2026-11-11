import { useId, useMemo, useState } from "react";
import { DeltaBadge } from "../DeltaBadge";
import { fmtCompact } from "../format";
import { useAncho } from "../hooks";
import { useChartChrome } from "../theme";
import { marcasY, mesTexto, pathArea, pathLinea } from "./escala";

export interface PanelArea {
  id: string;
  label: string;
  color: string;
  valores: number[];
  /** valor que se rotula en la cabecera (por defecto, el último de la serie) */
  valor?: number;
  delta?: number | null;
  /** seleccionado por cross-filter */
  activo?: boolean;
}

function MiniPanel({
  panel,
  meses,
  max,
  formato,
  hover,
  setHover,
  onClick,
  atenuado,
  altura,
}: {
  panel: PanelArea;
  meses: string[];
  max: number;
  formato: (v: number) => string;
  hover: number | null;
  setHover: (i: number | null) => void;
  onClick?: () => void;
  atenuado: boolean;
  altura: number;
}) {
  const c = useChartChrome();
  const gid = useId().replace(/:/g, "");
  const [ref, ancho] = useAncho();
  const n = panel.valores.length;
  const x = (i: number) => (n <= 1 ? ancho / 2 : (i / (n - 1)) * ancho);
  const y = (v: number) => altura - 2 - (v / max) * (altura - 4);
  const pts = panel.valores.map((v, i) => ({ x: x(i), y: y(v) }));
  const valor = hover != null ? panel.valores[hover] : panel.valor ?? panel.valores[n - 1];
  const color = atenuado ? c.deemphasis : panel.color;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-pressed={panel.activo}
      className={`group flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-colors ${
        panel.activo ? "border-brand bg-brand-soft/40" : "border-line hover:border-line-strong"
      } ${atenuado ? "opacity-60" : ""}`}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-subtle">
          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: panel.color }} />
          <span className="truncate">{panel.label}</span>
        </span>
        {hover == null && panel.delta !== undefined && <DeltaBadge valor={panel.delta ?? null} />}
        {hover != null && <span className="text-[11px] text-soft">{mesTexto(meses[hover])}</span>}
      </div>
      <div className="text-xl font-semibold leading-none tracking-tight text-ink-deep">{formato(valor ?? 0)}</div>
      <div ref={ref} className="w-full" style={{ height: altura }}>
        {ancho > 0 && (
          <svg width={ancho} height={altura} className="block overflow-visible">
            <defs>
              <linearGradient id={`m${gid}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <line x1={0} x2={ancho} y1={altura - 1} y2={altura - 1} stroke={c.grid} />
            <path d={pathArea(pts, altura - 1)} fill={`url(#m${gid})`} />
            <path d={pathLinea(pts)} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" />
            {hover != null && (
              <g pointerEvents="none">
                <line x1={x(hover)} x2={x(hover)} y1={0} y2={altura} stroke={c.subtle} strokeOpacity={0.35} />
                <circle cx={x(hover)} cy={y(panel.valores[hover])} r={3} fill={color} stroke={c.surface} strokeWidth={1.5} />
              </g>
            )}
            <rect
              width={ancho}
              height={altura}
              fill="transparent"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setHover(Math.min(n - 1, Math.max(0, Math.round(((e.clientX - r.left) / Math.max(1, ancho)) * (n - 1)))));
              }}
              onMouseLeave={() => setHover(null)}
            />
          </svg>
        )}
      </div>
    </button>
  );
}

/** Pequeños múltiplos: una mini-área por categoría con la MISMA escala (las alturas se comparan
    entre paneles), cursor sincronizado entre todos y clic = cross-filter. Sustituye a varias líneas
    superpuestas cuando hay más de 3-4 series. */
export function MultiplesArea({
  meses,
  paneles,
  formato = fmtCompact,
  altura = 64,
  escalaComun = true,
  onClick,
  minAnchoPanel = 200,
}: {
  meses: string[];
  paneles: PanelArea[];
  formato?: (v: number) => string;
  altura?: number;
  escalaComun?: boolean;
  onClick?: (id: string) => void;
  minAnchoPanel?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const maxComun = useMemo(() => marcasY(Math.max(1, ...paneles.flatMap((p) => p.valores))).max, [paneles]);
  const haySeleccion = paneles.some((p) => p.activo);
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minAnchoPanel}px, 1fr))` }}>
      {paneles.map((p) => (
        <MiniPanel
          key={p.id}
          panel={p}
          meses={meses}
          max={escalaComun ? maxComun : marcasY(Math.max(1, ...p.valores)).max}
          formato={formato}
          hover={hover}
          setHover={setHover}
          onClick={onClick ? () => onClick(p.id) : undefined}
          atenuado={haySeleccion && !p.activo}
          altura={altura}
        />
      ))}
    </div>
  );
}
