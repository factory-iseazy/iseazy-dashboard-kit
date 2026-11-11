import { ResponsiveWaffle } from "@nivo/waffle";
import { fmtCompact, fmtPct } from "../format";
import { useNivoTheme } from "../theme";

export interface ParteWaffle {
  id: string;
  label: string;
  value: number;
  color: string;
}

/** Mix parte-a-todo (@nivo/waffle): 100 celdas, 1 celda = 1 % — más honesto de
    leer que un pie (se cuentan celdas, no ángulos). */
export function WaffleMix({ partes, height = 300 }: { partes: ParteWaffle[]; height?: number }) {
  const nivoTheme = useNivoTheme();
  const total = partes.reduce((s, p) => s + p.value, 0);
  if (!total) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;
  return (
    <div>
      <div style={{ height }}>
        <ResponsiveWaffle
          data={partes}
          theme={nivoTheme as never}
          total={total}
          rows={10}
          columns={10}
          padding={2}
          borderRadius={2}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors={partes.map((p) => p.color)}
          fillDirection="top"
          animate={false}
        />
      </div>
      <div className="mt-3 flex flex-col gap-1">
        {partes.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 text-subtle">
              <span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} />
              {p.label}
            </span>
            <span className="tnum text-ink">
              <strong>{fmtCompact(p.value)}</strong>{" "}
              <span className="text-soft">{fmtPct(p.value / total)}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
