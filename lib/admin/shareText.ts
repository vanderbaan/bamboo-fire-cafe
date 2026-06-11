import { dayOfWeekName, isToday } from "./dates";
import type { DayRecord, SpecialItem } from "./types";

/**
 * Format a day's specials as Facebook share text. Matches Beverly's natural posting
 * style — emoji eyebrow, items as lines, optional blurb, phone + URL footer.
 *
 *   🌶️ Today's Specials at Bamboo Fire
 *   Oxtail Mac $28
 *   Creole Snapper $27
 *   Made fresh today
 *   Order: bamboofiredelray.com
 *   561-749-0973
 *
 * Rules:
 *   • Singular "Special" if 1 item; plural "Specials" if 2+.
 *   • "Today's" if the date matches today (NY-tz); otherwise "[DayName]'s".
 *   • Description line skipped when null/empty (no orphaned trailing newline).
 *   • Sold-out items are excluded from the share text — no point inviting orders for
 *     something already gone.
 */

const PHONE_DISPLAY = "561-749-0973";
const SITE_URL_DISPLAY = "bamboofiredelray.com";

interface ShareOpts {
  /** Defaults to "Bamboo Fire". Allows future merchant retemplating. */
  brand?: string;
}

export function formatShareText(
  record: Pick<DayRecord, "date" | "items" | "description">,
  opts: ShareOpts = {}
): string {
  const brand = opts.brand ?? "Bamboo Fire";
  const available = record.items.filter(
    (i: SpecialItem) => !i.soldOut && i.name.trim().length > 0
  );
  const isTodayDate = isToday(record.date);
  const dayPrefix = isTodayDate ? "Today's" : `${dayOfWeekName(record.date)}'s`;
  const noun =
    available.length === 1 ? "Special" : `Special${available.length > 1 ? "s" : ""}`;

  const lines: string[] = [];
  lines.push(`🌶️ ${dayPrefix} ${noun} at ${brand}`);
  for (const item of available) {
    const price = item.price.trim();
    // No leading dash — Beverly's posts read as bare lines.
    if (price) {
      lines.push(`${item.name} ${price}`);
    } else {
      lines.push(item.name);
    }
  }
  if (record.description && record.description.trim().length > 0) {
    lines.push(record.description.trim());
  }
  lines.push(`Order: ${SITE_URL_DISPLAY}`);
  lines.push(PHONE_DISPLAY);
  return lines.join("\n");
}

/** Default auto-gen alt text for a special photo. */
export function defaultPhotoAlt(items: SpecialItem[]): string {
  const names = items
    .filter((i) => i.name.trim().length > 0)
    .map((i) => i.name.trim());
  if (names.length === 0) return "Daily special at Bamboo Fire Cafe, Delray Beach";
  return `${names.join(" and ")} — daily special at Bamboo Fire Cafe, Delray Beach`;
}
