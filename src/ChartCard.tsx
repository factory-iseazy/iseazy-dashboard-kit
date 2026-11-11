/** Card contenedora de gráfica: título + subtítulo + acciones, altura estable. */
export function ChartCard({
  codigo,
  titulo,
  subtitulo,
  descripcion,
  acciones,
  children,
  className = "",
}: {
  /** código corto para señalar la gráfica sin ambigüedad (C1, A2, N4…) */
  codigo?: string;
  titulo: string;
  /** etiqueta técnica corta (p. ej. la librería/fuente del gráfico) */
  subtitulo?: string;
  /** explicación en lenguaje llano de qué representa y cómo leerlo */
  descripcion?: string;
  acciones?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex flex-col rounded-xl border border-line bg-card p-4 ${className}`}>
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-ink-deep">
            {codigo && (
              <span className="mr-2 rounded-md bg-muted px-1.5 py-0.5 align-middle font-mono text-[10px] font-bold text-subtle">
                {codigo}
              </span>
            )}
            {titulo}
            {subtitulo && <span className="ml-2 font-normal text-soft">{subtitulo}</span>}
          </h3>
          {descripcion && (
            <p className="mt-1 max-w-[85ch] text-[12.5px] leading-relaxed text-subtle">{descripcion}</p>
          )}
        </div>
        {acciones}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

export function EmptyState({ mensaje }: { mensaje: string }) {
  return (
    <div className="grid h-full min-h-32 place-items-center rounded-lg bg-muted-2 text-sm text-soft">
      {mensaje}
    </div>
  );
}
