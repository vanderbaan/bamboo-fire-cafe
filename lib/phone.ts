/**
 * Format an E.164 / international US phone number for display.
 *
 *   +15617490973 → "(561) 749-0973"
 *   15617490973  → "(561) 749-0973"
 *   5617490973   → "(561) 749-0973"
 *   anything else → returned unchanged
 *
 * Lifted out of components/sections/* (was duplicated in Hero, Footer, Location, and now
 * needed by OrderDropdown). Kept narrow on purpose — only handles US 10-digit numbers, which
 * matches every Lōcal merchant for the foreseeable future. If we ever onboard a non-US
 * merchant, widen this helper rather than adding a separate formatter.
 */
export function displayPhone(intl: string): string {
  const m = intl.match(/^\+1?(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : intl;
}
