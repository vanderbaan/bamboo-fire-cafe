import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BrandIdentity } from "@/types/content";

interface LogoProps {
  brand: BrandIdentity;
  /**
   * Tailwind width class(es) — caller controls the rendered width. Examples:
   *   "w-[160px]"
   *   "w-[150px] md:w-[220px]"
   * The intrinsic SVG aspect (brand.logoWidth × brand.logoHeight) is preserved by `h-auto`,
   * so callers only need to set width.
   */
  className?: string;
  priority?: boolean;
  /** next/image `sizes` hint. Defaults to a flat 240px (matches the largest desktop usage). */
  sizes?: string;
}

/**
 * Renders the merchant master logo. We treat the SVG as an asset, not inlined JSX, because
 * the Bamboo Fire SVG embeds a ~2 MB raster. `dangerouslyAllowSVG` + the locked-down CSP in
 * next.config.mjs ensure the served SVG cannot execute scripts.
 *
 * Sizing model: `width`/`height` props seed next/image's intrinsic dimensions for CLS
 * reservation, but the rendered size is driven by the caller's className (`w-[…]` etc.) and
 * `h-auto` preserves the aspect ratio. We deliberately do NOT apply `w-auto` — that lets the
 * browser substitute the natural pixel dimensions, which can make the logo render larger than
 * intended inside flex containers.
 */
export function Logo({ brand, className, priority, sizes }: LogoProps) {
  return (
    <Image
      src={brand.logoSrc}
      alt={brand.logoAlt}
      width={brand.logoWidth}
      height={brand.logoHeight}
      priority={priority}
      sizes={sizes ?? "240px"}
      className={cn("h-auto", className)}
    />
  );
}
