import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Lightweight shadcn-style Button. Stays loyal to brand tokens (bg-brand-fire, etc.) so the
 * next Lōcal merchant gets a re-skinned button by editing tailwind.config.ts only.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-card font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-fire focus-visible:ring-offset-2 focus-visible:ring-offset-surface-warm disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-fire text-white hover:bg-brand-fire-600 active:bg-brand-fire-700",
        secondary:
          "bg-brand-bamboo text-white hover:bg-brand-bamboo-600 active:bg-brand-bamboo-700",
        outline:
          "border border-ink/15 bg-surface text-ink hover:border-ink/30 hover:bg-surface-warm",
        ghost: "text-ink hover:bg-surface-warm",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {}

/** Button-styled <a> for tel: / mailto: / anchor links. */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
ButtonLink.displayName = "ButtonLink";

export { buttonVariants };
