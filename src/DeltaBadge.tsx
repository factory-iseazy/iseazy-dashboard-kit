import { fmtDelta, fmtDeltaPp } from "./format";

/** Delta con signo, color = dirección × si subir es bueno. `pp` para ratios. */
export function DeltaBadge({
  valor,
  invertir = false,
  pp = false,
  sufijo,
  decimales = 0,
}: {
  valor: number | null;
  invertir?: boolean;
  pp?: boolean;
  sufijo?: string;
  decimales?: number;
}) {
  if (valor == null) return <span className="text-xs text-soft">sin comparación</span>;
  const bueno = invertir ? valor <= 0 : valor >= 0; // 0 no es un empeoramiento
  const cls = bueno ? "text-success bg-success/10" : "text-destructive bg-destructive/10";
  return (
    <span className={`tnum inline-flex items-center gap-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-semibold ${cls}`}>
      <span aria-hidden>{valor >= 0 ? "▲" : "▼"}</span>
      {pp ? fmtDeltaPp(valor, decimales) : fmtDelta(valor, decimales)}
      {sufijo && <span className="ml-0.5 font-normal text-soft">{sufijo}</span>}
    </span>
  );
}
