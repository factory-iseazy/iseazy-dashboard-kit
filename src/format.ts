/* Formato numérico canónico (§6.4 del design system): es-ES, miles con punto,
   € detrás sin decimales, "—" cuando el valor no aplica. */

const nfInt = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
const nfCompact = new Intl.NumberFormat("es-ES", { notation: "compact", maximumFractionDigits: 1 });

export function fmtInt(v: number | null | undefined): string {
  return v == null ? "—" : nfInt.format(v);
}

export function fmtMoney(v: number | null | undefined): string {
  return v == null ? "—" : `${nfInt.format(v)} €`;
}

export function fmtCompact(v: number | null | undefined): string {
  return v == null ? "—" : nfCompact.format(v);
}

export function fmtCompactMoney(v: number | null | undefined): string {
  return v == null ? "—" : `${nfCompact.format(v)} €`;
}

export function fmtPct(v: number | null | undefined, decimales = 0): string {
  return v == null ? "—" : `${(v * 100).toFixed(decimales).replace(".", ",")} %`;
}

export function fmtDelta(v: number | null | undefined, decimales = 0): string {
  if (v == null) return "—";
  const s = (v * 100).toFixed(decimales).replace(".", ",");
  return `${v >= 0 ? "+" : ""}${s} %`;
}

/** Importe con signo, compacto: "+1,2 M €" / "−340 mil €". */
export function fmtDeltaMoney(v: number | null | undefined): string {
  if (v == null) return "—";
  return `${v >= 0 ? "+" : "−"}${nfCompact.format(Math.abs(v))} €`;
}

export function fmtDeltaPp(v: number | null | undefined, decimales = 0): string {
  if (v == null) return "—";
  const s = (v * 100).toFixed(decimales).replace(".", ",");
  return `${v >= 0 ? "+" : ""}${s} pp`;
}

const MESES_CORTOS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function fmtMes(mes: string): string {
  const [y, m] = mes.split("-").map(Number);
  return `${MESES_CORTOS[m - 1]} ${String(y).slice(2)}`;
}

export function fmtMesLargo(mes: string): string {
  const [y, m] = mes.split("-").map(Number);
  return `${MESES_CORTOS[m - 1]} ${y}`;
}
