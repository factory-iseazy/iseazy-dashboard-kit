import { ThemeToggle } from "./ThemeToggle";

const LOGOS = "https://raw.githubusercontent.com/factory-iseazy/iseazy-design-system/main/assets/logos/iseazy";

export interface Vista {
  id: string;
  label: string;
  /** grupo de la pregunta que responde (p. ej. "ARR", "Movimientos"); agrupa las pestañas */
  grupo?: string;
}

/** Pestañas de vistas, agrupadas por `grupo` con su rótulo (navegación por pregunta). */
function NavVistas({ vistas, vistaActiva, onVista }: { vistas: Vista[]; vistaActiva: string; onVista: (id: string) => void }) {
  const grupos: { grupo?: string; vistas: Vista[] }[] = [];
  for (const v of vistas) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.grupo === v.grupo) ultimo.vistas.push(v);
    else grupos.push({ grupo: v.grupo, vistas: [v] });
  }
  return (
    <nav className="flex min-w-0 flex-wrap items-center gap-x-0.5 gap-y-1" aria-label="Vistas">
      {grupos.map((g, gi) => (
        <div key={g.grupo ?? gi} className="flex items-center gap-0.5">
          {gi > 0 && <span aria-hidden className="mx-1.5 h-4 w-px bg-line" />}
          {g.grupo && (
            <span className="mr-0.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-soft">{g.grupo}</span>
          )}
          {g.vistas.map((v) => (
            <button
              key={v.id}
              onClick={() => onVista(v.id)}
              aria-current={vistaActiva === v.id ? "page" : undefined}
              className={`whitespace-nowrap rounded-md px-2 py-1 text-[13px] font-medium transition-colors ${
                vistaActiva === v.id ? "bg-brand-soft text-brand" : "text-subtle hover:bg-muted"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}

export type EstadoDato = "vivo" | "demo" | "sin-conexion";

export interface Frescura {
  estado: EstadoDato;
  /** Texto corto del badge, p. ej. "BBDD en vivo · 02/10 09:30". */
  texto: string;
  /** Detalle para el tooltip (fuente, cómo reintentar…). */
  detalle?: string;
}

const ESTILO_FRESCURA: Record<EstadoDato, string> = {
  vivo: "border-success/40 bg-success/10 text-success",
  demo: "border-warning/40 bg-warning/10 text-warning",
  "sin-conexion": "border-destructive/40 bg-destructive/10 text-destructive",
};

/** Badge de frescura del dato (§13.5): siempre visible, con fuente y fecha. */
export function FreshnessBadge({ frescura }: { frescura: Frescura }) {
  return (
    <span
      title={frescura.detalle}
      className={`whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${ESTILO_FRESCURA[frescura.estado]}`}
    >
      {frescura.texto}
    </span>
  );
}

/** Shell de dashboard (design system §5.25 + §13.2): header compacto con logo isEazy,
    nombre de la tool, pestañas de vistas, badge de frescura y toggle claro/oscuro; debajo,
    el rail de filtros (opcional) y el contenido. Los filtros del rail aplican a TODAS las vistas. */
export function DashboardShell({
  nombreTool,
  vistas,
  vistaActiva,
  onVista,
  frescura,
  rail,
  accionesHeader,
  children,
}: {
  nombreTool: string;
  vistas: Vista[];
  vistaActiva: string;
  onVista: (id: string) => void;
  frescura?: Frescura;
  rail?: React.ReactNode;
  accionesHeader?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-surface text-ink">
      <header className="z-20 flex min-h-14 shrink-0 items-center justify-between gap-4 border-b border-line bg-card px-4 py-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex shrink-0 items-center gap-3">
            <img src={`${LOGOS}/iseazy.svg`} alt="isEazy" className="block h-6 w-auto dark:hidden" />
            <img src={`${LOGOS}/iseazy-white.svg`} alt="isEazy" className="hidden h-6 w-auto dark:block" />
            <span className="hidden whitespace-nowrap border-l border-line pl-3 text-xs text-subtle lg:inline">
              {nombreTool}
            </span>
          </div>
          {(vistas.length > 1 || vistas.some((v) => v.grupo)) && (
            <NavVistas vistas={vistas} vistaActiva={vistaActiva} onVista={onVista} />
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {accionesHeader}
          {frescura && <FreshnessBadge frescura={frescura} />}
          <ThemeToggle />
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        {rail}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1240px] p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

/** Pantalla completa de carga/error, dentro del mismo fondo que el shell. */
export function FullScreenMessage({ titulo, detalle, cargando }: { titulo: string; detalle?: string; cargando?: boolean }) {
  return (
    <div className="grid h-screen place-items-center bg-surface p-8 text-center text-subtle">
      <div>
        {cargando && (
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />
        )}
        <p className="mb-1 font-semibold text-ink-deep">{titulo}</p>
        {detalle && <p className="text-sm">{detalle}</p>}
      </div>
    </div>
  );
}
