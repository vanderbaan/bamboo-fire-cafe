import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BrandIdentity } from "@/types/content";

interface LogoProps {
  brand: BrandIdentity;
  /** Rendered width in CSS px; height is derived from aspect ratio. */
  width?: number;
  className?: string;
  priority?: boolean;
}

/** Render the merchant master logo. The SVG embeds raster art, so we treat it as an asset. */
export function Logo({ brand, width = 220, className, priority }: LogoProps) {
  const ratio = brand.logoHeight / brand.logoWidth;
  const height = Math.round(width * ratio);
  return (
    <Image
      src={brand.logoSrc}
      alt={brand.logoAlt}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto", className)}
      sizes={`${width}px`}
    />
  );
}
