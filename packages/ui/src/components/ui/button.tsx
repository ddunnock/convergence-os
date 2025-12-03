/**
 * @module @convergence/ui/components/ui/button
 * @file Button component with variant and size support. Provides a flexible
 *   button component using class-variance-authority for styling variants and
 *   Radix UI Slot for composition.
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Creates button variant styles using class-variance-authority.
 *
 * Defines all available button variants and sizes with their corresponding
 * Tailwind CSS classes. Includes focus, disabled, and accessibility states.
 *
 * @example
 *   ```typescript
 *   const classes = buttonVariants({ variant: "default", size: "lg" });
 *   ```;
 *
 * @returns CVA function for generating button class names
 * @see {@link https://cva.style/docs class-variance-authority}
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border border-white/30 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md active:scale-[0.98] active:border-primary/50",
        destructive:
          "bg-gradient-to-r from-pink-500 to-pink-500/80 text-white border border-white/30 shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md active:scale-[0.98] active:border-pink-400/50 focus-visible:ring-pink-500/50",
        outline:
          "border border-glass-border bg-white/10 backdrop-blur-md text-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-white/20 hover:border-primary/30 active:translate-y-0 active:shadow-sm active:scale-[0.98] active:border-primary/50",
        secondary:
          "bg-secondary/40 backdrop-blur-md text-secondary-foreground border border-glass-border shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-secondary/60 hover:border-primary/20 active:translate-y-0 active:shadow-sm active:scale-[0.98] active:border-primary/40",
        ghost:
          "text-foreground hover:bg-accent/50 hover:text-accent-foreground active:scale-[0.98] active:bg-accent/70",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button component with variant and size support.
 *
 * A flexible button component that supports multiple visual variants (default,
 * destructive, outline, secondary, ghost, link) and sizes (default, sm, lg,
 * icon variants). Can render as a native button element or compose with other
 * components using the asChild prop.
 *
 * @example
 *   ```tsx
 *   // Default button
 *   <Button>Click me</Button>
 *
 *   // Destructive variant with small size
 *   <Button variant="destructive" size="sm">Delete</Button>
 *
 *   // Outline variant with icon
 *   <Button variant="outline" size="icon">
 *     <Icon />
 *   </Button>
 *
 *   // As child component (composes with Link)
 *   <Button asChild>
 *     <Link href="/about">About</Link>
 *   </Button>
 *   ```;
 *
 * @param props - Button component props
 * @param props.className - Additional CSS classes to merge with variant classes
 * @param props.variant - Visual variant style (default: "default")
 * @param props.size - Size variant (default: "default")
 * @param props.asChild - If true, renders as child component using Radix Slot
 *   (default: false)
 * @param props.disabled - Whether the button is disabled
 * @param props.type - Button type attribute (button, submit, reset)
 * @param props.onClick - Click event handler
 * @param props.children - Button content (text, icons, etc.)
 * @param props... - All other standard button HTML attributes
 * @returns React button component
 * @see {@link buttonVariants} For available variants and sizes
 * @see {@link https://www.radix-ui.com/primitives/docs/components/slot Radix UI Slot}
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
