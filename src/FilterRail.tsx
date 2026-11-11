import { useState } from "react";
import { fmtCompact } from "./format";

/* Piezas del rail de filtros (design system §13.2): ~260 px, orden fijo periodo → comparación →
   dimensiones con contadores, estado en la URL. El kit da las piezas; QUÉ filtros hay lo decide
   cada app (sus dimensiones y su estado viven en la app, nunca en el kit). */

/** Contenedor del rail: columna con scroll propio y un pie opcional (p. ej. "Restablecer"). */
export function FilterRail({ children, pie }: { children: React.ReactNode; pie?: React.ReactNode }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-line bg-card" aria-label="Filtros">
      {children}
      {pie && <div className="mt-auto border-t border-line p-4">{pie}</div>}
    </aside>
  );
}

/** Grupo con título dentro del rail. */
export function RailGroup({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line px-4 py-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-soft">{titulo}</div>
      {children}
    </div>
  );
}

/** Opción seleccionable con contador opcional (dimensiones y presets de periodo). */
export function RailOption({
  activo,
  onClick,
  label,
  cuenta,
}: {
  activo: boolean;
  onClick: () => void;
  label: string;
  cuenta?: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activo}
      className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors ${
        activo ? "bg-brand-soft font-medium text-ink-deep" : "text-subtle hover:bg-muted-2"
      }`}
    >
      <span className="flex items-center gap-2 truncate">
        <span
          aria-hidden
          className={`inline-block h-3 w-3 rounded-[4px] border ${
            activo ? "border-brand bg-brand" : "border-line-strong bg-card"
          }`}
        />
        <span className="truncate">{label}</span>
      </span>
      {cuenta !== undefined && <span className="tnum text-[11px] text-soft">{fmtCompact(cuenta)}</span>}
    </button>
  );
}

/** Interruptor del rail (agrupaciones, modos binarios). */
export function RailInterruptor({
  activo,
  onChange,
  label,
  ayuda,
}: {
  activo: boolean;
  onChange: (v: boolean) => void;
  label: string;
  ayuda?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={activo}
      onClick={() => onChange(!activo)}
      title={ayuda}
      className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-[13px] text-subtle hover:bg-muted-2"
    >
      <span className="truncate">{label}</span>
      <span
        aria-hidden
        className={`relative h-[18px] w-8 shrink-0 rounded-full transition-colors ${activo ? "bg-brand" : "bg-line-strong"}`}
      >
        <span
          className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-card shadow-sm transition-transform ${
            activo ? "translate-x-[16px]" : "translate-x-[2px]"
          }`}
        />
      </span>
    </button>
  );
}

/** Lista larga con buscador (clientes, cuentas…): muestra las `visibles` primeras por contador,
    filtra al escribir y declara cuántas quedan fuera (§13.5: ningún recorte silencioso). */
export function RailBuscador({
  opciones,
  seleccion,
  onToggle,
  placeholder = "Buscar…",
  visibles = 8,
}: {
  opciones: { valor: string; cuenta?: number }[];
  seleccion: string[];
  onToggle: (valor: string) => void;
  placeholder?: string;
  visibles?: number;
}) {
  const [q, setQ] = useState("");
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const filtradas = q ? opciones.filter((o) => norm(o.valor).includes(norm(q))) : opciones;
  const seleccionadas = opciones.filter((o) => seleccion.includes(o.valor));
  const resto = filtradas.filter((o) => !seleccion.includes(o.valor));
  const mostradas = resto.slice(0, visibles);
  return (
    <div className="flex flex-col gap-1">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="mb-1 w-full rounded-md border border-line bg-card px-2 py-1 text-[13px] text-ink placeholder:text-soft focus:border-brand focus:outline-none"
      />
      {seleccionadas.map((o) => (
        <RailOption key={o.valor} activo onClick={() => onToggle(o.valor)} label={o.valor} cuenta={o.cuenta} />
      ))}
      {mostradas.map((o) => (
        <RailOption key={o.valor} activo={false} onClick={() => onToggle(o.valor)} label={o.valor} cuenta={o.cuenta} />
      ))}
      {resto.length > mostradas.length && (
        <p className="px-2 pt-1 text-[11px] text-soft">
          {mostradas.length} de {resto.length}
          {q ? " que coinciden" : ""} · escribe para buscar
        </p>
      )}
      {q && !filtradas.length && <p className="px-2 text-[11px] text-soft">Sin resultados</p>}
    </div>
  );
}
