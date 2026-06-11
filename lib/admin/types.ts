/**
 * Data model for the Daily Specials admin. Mirrors the shape stored in Vercel KV.
 *
 * Keys: `specials-schedule:{YYYY-MM-DD}` — one record per day. The date is the calendar
 * date in `America/New_York` (the merchant's timezone), so day boundaries match Beverly's
 * intuition regardless of whether the request comes from Vercel's US-East region or a
 * customer's Pacific phone.
 */

export interface SpecialItem {
  name: string;
  /** Display string — accepts "$28", "28", "MKT", etc. Stored as-is for forward compat. */
  price: string;
  soldOut: boolean;
}

export interface SpecialPhoto {
  /** Absolute URL to the .jpg variant in Vercel Blob. */
  jpgUrl: string;
  /** Absolute URL to the .webp variant — same UUID, different extension. */
  webpUrl: string;
  /** Optional explicit alt-text override. When null, components auto-generate. */
  alt: string | null;
  /** Pixel dimensions of the source (post-resize) for CLS reservation in <Image>. */
  width: number;
  height: number;
}

export type EditorIdentity = "beverly" | "jan";

export interface DayRecord {
  /** ISO date string in America/New_York calendar terms, YYYY-MM-DD. Echoed for safety. */
  date: string;
  items: SpecialItem[];
  /** Short prose blurb. null when unset (vs empty string to make intent unambiguous). */
  description: string | null;
  photo: SpecialPhoto | null;
  /** When false, the day's data is preserved but it's hidden from the public homepage. */
  active: boolean;
  /** ISO 8601 timestamp WITH offset, e.g. "2026-06-10T09:15:00-04:00". */
  updatedAt: string;
  updatedBy: EditorIdentity;
}

/** Body shape for POST /api/admin/day/[date]. */
export interface UpsertDayBody {
  items: SpecialItem[];
  description: string | null;
  photo: SpecialPhoto | null;
  active: boolean;
}

/** Shape for GET /api/admin/schedule?weekOf=. */
export interface WeekSlice {
  /** Sunday of the queried week (YYYY-MM-DD, NY tz). */
  weekStart: string;
  /** Saturday of the queried week (YYYY-MM-DD, NY tz). */
  weekEnd: string;
  /** 7 entries; null when no record exists for that day. */
  days: Array<{ date: string; record: DayRecord | null }>;
}

/** Public response for GET /api/specials/today. Null when nothing active is published. */
export type PublicTodayResponse = {
  date: string;
  items: SpecialItem[];
  description: string | null;
  photo: SpecialPhoto | null;
} | null;
