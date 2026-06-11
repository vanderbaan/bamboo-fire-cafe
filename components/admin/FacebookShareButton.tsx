"use client";

import { formatShareText } from "@/lib/admin/shareText";
import type { DayRecord } from "@/lib/admin/types";

const SITE_URL = "https://www.bamboofiredelray.com";
const FB_PAGE = "https://www.facebook.com/BambooFireDelray/";

/**
 * Trigger the Facebook share flow. Three fallback paths:
 *   1. navigator.share — native share sheet (iOS/Android). Best experience: Beverly
 *      picks Facebook from the share sheet, post is half-composed for her.
 *   2. clipboard.writeText + open FB page in a new tab — desktop browsers without
 *      Web Share. We copy the text so she pastes into Facebook's composer.
 *   3. sharer URL — last resort. Old browsers; opens FB's mid-2010s share dialog.
 */
export async function shareToFacebook(
  record: DayRecord,
  showToast: (msg: string) => void
): Promise<void> {
  const text = formatShareText(record);

  const navAny = navigator as unknown as {
    share?: (data: { title: string; text: string; url: string }) => Promise<void>;
    clipboard?: { writeText: (text: string) => Promise<void> };
  };

  if (typeof navAny.share === "function") {
    try {
      await navAny.share({
        title: "Bamboo Fire Specials",
        text,
        url: SITE_URL,
      });
      return;
    } catch {
      // User canceled or share failed — fall through to clipboard path.
    }
  }

  if (navAny.clipboard?.writeText) {
    try {
      await navAny.clipboard.writeText(`${text}\n\n${SITE_URL}`);
      window.open(FB_PAGE, "_blank", "noopener,noreferrer");
      showToast("Text copied. Paste into Facebook.");
      return;
    } catch {
      // Clipboard refused (older browsers, file:// origin). Final fallback.
    }
  }

  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    SITE_URL
  )}&quote=${encodeURIComponent(text)}`;
  window.open(fbUrl, "_blank", "width=600,height=400,noopener,noreferrer");
}
