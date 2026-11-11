import { fmtDeltaPp, fmtInt, fmtPct } from "../format";
import { STATUS } from "../theme";

export interface PasoFunnel {
  label: string;
  valor: number;
  color: string;
}

/** Forma "embudo" del kit: barras proporcionales con la tasa de conversión
    anotada ENTRE pasos (los ratios viven sobre el embudo, no en tarjetas
    aparte) y su Δ en pp vs. comparación cuando está activa. */
export function FunnelSteps({
  pasos,
  pasosCmp,
  nota,
}: {
  pasos: PasoFunnel[];
  pasosCmp?: number[] | null;
  nota?: string;
}) {
  const max = Math.max(...pasos.map((p) => p.valor), 1);
  return (
    <div className="flex flex-col">
      {pasos.map((p, i) => {
        const conv = i > 0 && pasos[i - 1].valor ? p.valor / pasos[i - 1].valor : null;
        const convCmp =
          i > 0 && pasosCmp && pasosCmp[i - 1] ? (pasosCmp[i] ?? 0) / pasosCmp[i - 1] : null;
        const deltaPp = conv != null && convCmp != null ? conv - convCmp : null;
        return (
          <div key={p.label}>
            {i > 0 && (
              <div className="ml-[110px] flex items-center gap-2 py-0.5 pl-1 text-[11px] text-soft">
                <span aria-hidden>↳</span>
                <span className="tnum font-semibold text-subtle">{fmtPct(conv)}</span>
                {deltaPp != null && (
                  <span
                    className="tnum font-semibold"
                    style={{ color: deltaPp >= 0 ? STATUS.positivo : STATUS.negativo }}
                  >
                    {fmtDeltaPp(deltaPp)}
                  </span>
                )}
              </div>
            )}
            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
              <span className="truncate text-xs text-subtle">{p.label}</span>
              <span className="flex items-center gap-2">
                <span
                  className="h-[22px] rounded-r-[4px]"
                  style={{ width: `max(${((p.valor / max) * 70).toFixed(2)}%, 3px)`, background: p.color }}
                />
                <span className="tnum whitespace-nowrap text-xs font-semibold text-ink">{fmtInt(p.valor)}</span>
                <span className="tnum whitespace-nowrap text-[11px] text-soft">
                  {fmtPct(pasos[0].valor ? p.valor / pasos[0].valor : null)}
                </span>
              </span>
            </div>
          </div>
        );
      })}
      {nota && <p className="mt-3 text-[11px] leading-snug text-soft">{nota}</p>}
    </div>
  );
}
