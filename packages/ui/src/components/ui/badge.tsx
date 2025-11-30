/**
 * @fileoverview Badge component for displaying labels, status indicators, and tags.
 * Provides a flexible badge component with multiple variants using class-variance-authority
 * for styling and Radix UI Slot for composition.
 * @module @convergence/ui/components/ui/badge
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Creates badge variant styles using class-variance-authority.
 *
 * @description Defines all available badge variants with their corresponding
 * Tailwind CSS classes. Includes focus, hover, and accessibility states.
 *
 * @returns CVA function for generating badge class names
 *
 * @example
 * ```typescript
 * const classes = badgeVariants({ variant: "default" });
 * ```
 *
 * @see {@link https://cva.style/docs class-variance-authority}
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Props for the Badge component.
 *
 * Extends React span props and variant props from badgeVariants.
 *
 * @property {boolean} [asChild=false] - If true, the component will render its child as a badge.
 */
export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

/**
 * Renders a customizable badge component.
 *
 * @description This component supports various visual styles and can render as a child component.
 * Commonly used for labels, status indicators, tags, and notifications.
 *
 * @param props - The properties for the Badge component
 * @param props.className - Additional CSS classes to apply to the badge
 * @param props.variant - The visual style of the badge (default, secondary, destructive, outline)
 * @param props.asChild - If true, the component will render its child as a badge
 * @param props.children - Badge content (text, icons, etc.)
 * @param props... - All other standard span HTML attributes
 * @returns {JSX.Element} The rendered badge component
 *
 * @example
 * ```tsx
 * <Badge>New</Badge>
 * <Badge variant="secondary">Draft</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline">Tag</Badge>
 * ```
 *
 * @example
 * ```tsx
 * <Badge asChild>
 *   <Link href="/tags/react">React</Link>
 * </Badge>
 * ```
 *
 * @see badgeVariants
 */
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
