import { ResponsiveCalendar } from "@nivo/calendar";
import { fmtInt } from "../format";
import { useNivoTheme, RAMPA_MAGENTA } from "../theme";

/** Pulso diario (@nivo/calendar): un año de leads día a día — se ven los fines
    de semana, los picos de campaña/evento y los parones de un vistazo. */
export function CalendarioDiario({
  dias,
  desde,
  hasta,
  height = 340,
}: {
  dias: { day: string; value: number }[];
  desde: string; // "YYYY-MM-DD"
  hasta: string;
  height?: number;
}) {
  const nivoTheme = useNivoTheme();
  if (!dias.length) return <p className="py-6 text-center text-sm text-soft">Sin datos diarios.</p>;
  return (
    <div style={{ height }}>
      <ResponsiveCalendar
        data={dias}
        theme={nivoTheme as never}
        from={desde}
        to={hasta}
        emptyColor="#F8F8F8"
        colors={RAMPA_MAGENTA.slice(1)}
        margin={{ top: 24, right: 10, bottom: 2, left: 26 }}
        yearSpacing={34}
        monthBorderWidth={2}
        monthBorderColor="#FFFFFF"
        dayBorderWidth={2}
        dayBorderColor="#FFFFFF"
        daySpacing={0}
        monthLegendOffset={8}
        tooltip={({ day, value }) => (
          <div className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs shadow-md">
            <span className="font-medium text-ink-deep">{day}</span>{" "}
            <span className="tnum font-semibold text-ink">{fmtInt(Number(value))} leads</span>
          </div>
        )}
      />
    </div>
  );
}
