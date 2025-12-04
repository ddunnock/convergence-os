/**
 * @module @convergence/ui/components/ui/glass/avatar
 * @file Glass Avatar - Enhanced avatar component with glassmorphism effects.
 *   Provides a user avatar with customizable size variants and optional glow
 *   effects for visual emphasis.
 */

"use client";

import * as React from "react";
import {
  Avatar as BaseAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * Props for the Glass Avatar component.
 *
 * Extends the base Avatar props with glass-specific options for size variants
 * and glow effects.
 *
 * @extends {React.ComponentProps<typeof BaseAvatar>}
 * @interface AvatarProps
 */
export interface AvatarProps extends React.ComponentProps<typeof BaseAvatar> {
  /**
   * Whether to apply a purple glow effect around the avatar. Useful for
   * highlighting active users or important profiles.
   *
   * @default false
   */
  glow?: boolean;

  /**
   * The size variant for the avatar.
   *
   * - `sm`: 32x32px (h-8 w-8)
   * - `md`: 40x40px (h-10 w-10)
   * - `lg`: 64x64px (h-16 w-16)
   *
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
}

/**
 * Glass-styled avatar with customizable size and glow effects.
 *
 * An enhanced version of the base Avatar that supports predefined size variants
 * and an optional purple glow effect. Use this component for user profiles,
 * team members, or any visual identity representation.
 *
 * @example
 *   ```tsx
 *   // Basic avatar with image
 *   <Avatar>
 *     <AvatarImage src="/user.jpg" alt="User" />
 *     <AvatarFallback>JD</AvatarFallback>
 *   </Avatar>
 *   ```;
 *
 * @example
 *   ```tsx
 *   // Large avatar with glow effect
 *   <Avatar size="lg" glow>
 *     <AvatarImage src="/profile.jpg" alt="Profile" />
 *     <AvatarFallback>AB</AvatarFallback>
 *   </Avatar>
 *   ```;
 *
 * @example
 *   ```tsx
 *   // Small avatar for compact layouts
 *   <Avatar size="sm">
 *     <AvatarFallback>U</AvatarFallback>
 *   </Avatar>
 *   ```;
 *
 * @param props - Avatar component props
 * @param props.className - Additional CSS classes to merge with size and glow
 *   classes
 * @param props.glow - Whether to apply a purple glow effect (default: false)
 * @param props.size - Size variant: "sm", "md", or "lg" (default: "md")
 * @param props.children - Avatar content (AvatarImage and/or AvatarFallback)
 * @param props... - All other standard Avatar HTML attributes
 * @returns Glass-styled avatar element
 * @see {@link AvatarImage} For displaying avatar images
 * @see {@link AvatarFallback} For fallback content when image fails
 */
export const Avatar = React.forwardRef<
  React.ElementRef<typeof BaseAvatar>,
  AvatarProps
>(({ className, glow = false, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <BaseAvatar
      ref={ref}
      className={cn(
        sizeClasses[size],
        glow && "ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/20",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  );
});
Avatar.displayName = "Avatar";

/**
 * Image component for the Avatar. Displays the user's profile picture or other
 * avatar image.
 *
 * @see {@link https://www.radix-ui.com/primitives/docs/components/avatar Radix UI Avatar}
 */
export { AvatarImage };

/**
 * Fallback component for the Avatar. Displayed when the image fails to load or
 * is not provided. Typically shows user initials or a placeholder icon.
 *
 * @see {@link https://www.radix-ui.com/primitives/docs/components/avatar Radix UI Avatar}
 */
export { AvatarFallback };
