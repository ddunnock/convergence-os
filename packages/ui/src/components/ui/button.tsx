/**
 * @fileoverview Button component with variant and size support.
 * Provides a flexible button component using class-variance-authority for
 * styling variants and Radix UI Slot for composition.
 * @module @convergence/ui/components/ui/button
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Creates button variant styles using class-variance-authority.
 * @description Defines all available button variants and sizes with their
 * corresponding Tailwind CSS classes. Includes focus, disabled, and accessibility states.
 *
 * @returns CVA function for generating button class names
 *
 * @example
 * ```typescript
 * const classes = buttonVariants({ variant: "default", size: "lg" });
 * ```
 *
 * @see {@link https://cva.style/docs class-variance-authority}
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
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
)

/**
 * Button component with variant and size support.
 *
 * @description A flexible button component that supports multiple visual variants
 * (default, destructive, outline, secondary, ghost, link) and sizes (default, sm, lg, icon variants).
 * Can render as a native button element or compose with other components using the asChild prop.
 *
 * @param props - Button component props
 * @param props.className - Additional CSS classes to merge with variant classes
 * @param props.variant - Visual variant style (default: "default")
 * @param props.size - Size variant (default: "default")
 * @param props.asChild - If true, renders as child component using Radix Slot (default: false)
 * @param props.disabled - Whether the button is disabled
 * @param props.type - Button type attribute (button, submit, reset)
 * @param props.onClick - Click event handler
 * @param props.children - Button content (text, icons, etc.)
 * @param props... - All other standard button HTML attributes
 * @returns React button component
 *
 * @example
 * ```tsx
 * // Default button
 * <Button>Click me</Button>
 *
 * // Destructive variant with small size
 * <Button variant="destructive" size="sm">Delete</Button>
 *
 * // Outline variant with icon
 * <Button variant="outline" size="icon">
 *   <Icon />
 * </Button>
 *
 * // As child component (composes with Link)
 * <Button asChild>
 *   <Link href="/about">About</Link>
 * </Button>
 * ```
 *
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
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
