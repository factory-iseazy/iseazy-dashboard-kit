const ESTILOS = {
  success: { borde: "border-success/40", bg: "bg-success/5", titulo: "text-success", icono: "▲" },
  destructive: { borde: "border-destructive/40", bg: "bg-destructive/5", titulo: "text-destructive", icono: "▼" },
  warning: { borde: "border-warning/40", bg: "bg-warning/5", titulo: "text-warning", icono: "◆" },
  info: { borde: "border-info/40", bg: "bg-info/5", titulo: "text-info", icono: "ℹ" },
} as const;

export type InsightVariant = keyof typeof ESTILOS;

/** Tarjeta de "lo más relevante": el color/título respeta SIEMPRE el signo real
    del dato (regla heredada del F-24 de la tool original). */
export function InsightCard({
  variant,
  titulo,
  children,
}: {
  variant: InsightVariant;
  titulo: string;
  children: React.ReactNode;
}) {
  const e = ESTILOS[variant];
  return (
    <div className={`flex gap-3 rounded-xl border ${e.borde} ${e.bg} px-4 py-3`}>
      <span aria-hidden className={`text-sm font-bold ${e.titulo}`}>{e.icono}</span>
      <div className="min-w-0">
        <div className={`text-[11px] font-bold uppercase tracking-wide ${e.titulo}`}>{titulo}</div>
        <div className="mt-0.5 text-sm leading-snug text-ink">{children}</div>
      </div>
    </div>
  );
}
