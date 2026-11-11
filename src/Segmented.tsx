/** Control segmentado compacto (selector de etapa, modo de comparación…). */
export function Segmented<T extends string>({
  opciones,
  valor,
  onChange,
  labels,
}: {
  opciones: readonly T[];
  valor: T;
  onChange: (v: T) => void;
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <div role="tablist" className="inline-flex rounded-lg border border-line bg-muted p-0.5">
      {opciones.map((o) => (
        <button
          key={o}
          role="tab"
          aria-selected={o === valor}
          onClick={() => onChange(o)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            o === valor ? "bg-card text-ink-deep shadow-sm" : "text-subtle hover:text-ink"
          }`}
        >
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}
