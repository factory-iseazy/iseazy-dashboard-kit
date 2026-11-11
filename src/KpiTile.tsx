import { DeltaBadge } from "./DeltaBadge";
import { Sparkline } from "./Sparkline";

/** Stat tile del kit: label · valor (cifras proporcionales) · delta · sparkline.
    `hero` = el número que lidera la vista (mayor tamaño, uno por vista). */
export function KpiTile({
  label,
  valor,
  delta,
  invertirDelta = false,
  deltaPp = false,
  serie,
  color = "#EB1C79",
  hero = false,
  ayuda,
  detalle,
  sufijoDelta,
  decimales = 0,
  onClick,
}: {
  label: string;
  valor: string;
  delta?: number | null;
  invertirDelta?: boolean;
  deltaPp?: boolean;
  serie?: number[];
  color?: string;
  hero?: boolean;
  ayuda?: string;
  /** línea secundaria bajo el valor (p. ej. el delta en € o la base de comparación) */
  detalle?: React.ReactNode;
  /** a qué se compara el delta ("vs. 2025"): §13.4, delta frente a un periodo NOMBRADO */
  sufijoDelta?: string;
  decimales?: number;
  /** el tile abre su detalle */
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`flex h-full w-full flex-col justify-between gap-2 rounded-xl border border-line bg-card p-4 text-left ${
        onClick ? "transition-colors hover:border-line-strong hover:bg-muted-2/60" : ""
      }`}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-subtle" title={ayuda}>
        {label}
        {ayuda && (
          <span aria-label={ayuda} className="grid h-3.5 w-3.5 cursor-help place-items-center rounded-full border border-line-strong text-[9px] leading-none text-soft">
            ?
          </span>
        )}
      </div>
      <div className={`font-semibold text-ink-deep ${hero ? "text-4xl" : "text-2xl"} leading-none tracking-tight`}>
        {valor}
      </div>
      {detalle && <div className="text-xs text-subtle">{detalle}</div>}
      <div className="flex items-end justify-between gap-2">
        {delta !== undefined ? (
          <DeltaBadge valor={delta} invertir={invertirDelta} pp={deltaPp} sufijo={sufijoDelta} decimales={decimales} />
        ) : (
          <span />
        )}
        {serie && <Sparkline valores={serie} color={color} width={hero ? 140 : 96} height={hero ? 40 : 30} />}
      </div>
    </Tag>
  );
}
