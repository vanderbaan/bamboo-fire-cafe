import { hoursRows } from "@/lib/hours";
import type { Hours } from "@/types/content";

interface Props {
  hours: Hours;
  className?: string;
}

/** Reusable expanded weekday hours table — used in Location and (compact form) in Footer. */
export function HoursDisplay({ hours, className }: Props) {
  const rows = hoursRows(hours);
  return (
    <table className={className}>
      <caption className="sr-only">Hours of operation</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key} className="border-b border-ink/5 last:border-0">
            <th
              scope="row"
              className="py-2 pr-6 text-left font-medium text-ink"
            >
              {row.long}
            </th>
            <td
              className={`py-2 ${row.isClosed ? "text-ink-muted" : "text-ink"}`}
            >
              {row.display}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
