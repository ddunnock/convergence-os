/**
 * @fileoverview Theme provider component for managing theme variants and color modes.
 * Combines a custom theme variant system with next-themes for light/dark mode support.
 * @module @convergence/ui/providers/theme-provider
 */

"use client";

import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";
import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * Available theme variants for the application.
 * @description Each variant corresponds to a CSS file in /public/themes/
 *
 * @example
 * ```typescript
 * const variant: ThemeVariant = "convergence";
 * ```
 */
export type ThemeVariant = "convergence" | "synthwave";

/**
 * Available color modes for the application.
 * @description "system" follows the user's OS preference
 *
 * @example
 * ```typescript
 * const mode: ColorMode = "dark";
 * ```
 */
export type ColorMode = "light" | "dark" | "system";

/**
 * Context value provided by ThemeProvider.
 * @description Contains all theme state and setter functions
 *
 * @example
 * ```typescript
 * const { themeVariant, setThemeVariant, colorMode, mounted } = useTheme();
 * ```
 */
export interface ThemeContextValue {
  /** Current theme variant (convergence, synthwave) */
  themeVariant: ThemeVariant;
  /** Set the theme variant */
  setThemeVariant: (variant: ThemeVariant) => void;
  /** Current color mode setting (light, dark, system) */
  colorMode: ColorMode;
  /** Set the color mode */
  setColorMode: (mode: ColorMode) => void;
  /** Resolved color mode after system preference is applied */
  resolvedColorMode: "light" | "dark";
  /** Whether the component has mounted (use for hydration safety) */
  mounted: boolean;
}

/**
 * React context for theme values.
 * @internal
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * localStorage key for persisting theme variant.
 * @internal
 */
export const THEME_VARIANT_KEY = "convergence-theme-variant";

/**
 * Subscription listeners for theme variant changes.
 * @internal
 */
let themeVariantListeners: Array<() => void> = [];

/**
 * Current theme variant value.
 * @internal
 */
let currentThemeVariant: ThemeVariant = "convergence";

/**
 * Gets the current theme variant for useSyncExternalStore.
 * @internal
 * @returns The current theme variant
 */
function getThemeVariantSnapshot(): ThemeVariant {
  return currentThemeVariant;
}

/**
 * Subscribes to theme variant changes for useSyncExternalStore.
 * @internal
 * @param callback - Function to call when theme variant changes
 * @returns Unsubscribe function
 */
function subscribeToThemeVariant(callback: () => void): () => void {
  themeVariantListeners.push(callback);
  return () => {
    themeVariantListeners = themeVariantListeners.filter((l) => l !== callback);
  };
}

/**
 * Sets the theme variant and notifies all subscribers.
 * @internal
 * @param variant - The new theme variant to set
 */
function setThemeVariantInternal(variant: ThemeVariant): void {
  currentThemeVariant = variant;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(THEME_VARIANT_KEY, variant);
    } catch {
      // localStorage may be full or unavailable
    }
  }
  themeVariantListeners.forEach((listener) => listener());
}

/**
 * Validates if a value is a valid theme variant.
 * @param value - Value to check
 * @returns True if value is a valid ThemeVariant
 */
export function isValidThemeVariant(value: unknown): value is ThemeVariant {
  return value === "convergence" || value === "synthwave";
}

// Initialize from localStorage on client
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem(THEME_VARIANT_KEY);
    if (isValidThemeVariant(stored)) {
      currentThemeVariant = stored;
    }
  } catch {
    // localStorage may not be available
  }
}

/**
 * Subscription listeners for mounted state changes.
 * @internal
 */
let mountedListeners: Array<() => void> = [];

/**
 * Whether the application has mounted on the client.
 * @internal
 */
let isMounted = false;

/**
 * Gets the mounted state for useSyncExternalStore (client).
 * @internal
 * @returns Whether the app is mounted
 */
function getMountedSnapshot(): boolean {
  return isMounted;
}

/**
 * Gets the mounted state for useSyncExternalStore (server).
 * @internal
 * @returns Always false on server
 */
function getMountedServerSnapshot(): boolean {
  return false;
}

/**
 * Subscribes to mounted state changes for useSyncExternalStore.
 * @internal
 * @param callback - Function to call when mounted state changes
 * @returns Unsubscribe function
 */
function subscribeToMounted(callback: () => void): () => void {
  mountedListeners.push(callback);
  return () => {
    mountedListeners = mountedListeners.filter((l) => l !== callback);
  };
}

// Set mounted on client
if (typeof window !== "undefined") {
  // Use microtask to ensure this runs after hydration
  queueMicrotask(() => {
    isMounted = true;
    mountedListeners.forEach((listener) => listener());
  });
}

/**
 * Internal provider component that manages theme variant state.
 * @internal
 * @param props - Component props
 * @param props.children - Child components
 * @param props.defaultVariant - Default theme variant for SSR
 */
function ThemeVariantProvider({
  children,
  defaultVariant = "convergence",
}: {
  children: ReactNode;
  defaultVariant?: ThemeVariant;
}) {
  const themeVariant = useSyncExternalStore(
    subscribeToThemeVariant,
    getThemeVariantSnapshot,
    () => defaultVariant
  );

  const mounted = useSyncExternalStore(
    subscribeToMounted,
    getMountedSnapshot,
    getMountedServerSnapshot
  );

  const { theme, setTheme, resolvedTheme } = useNextTheme();

  // Load theme CSS dynamically and set data-theme attribute
  useEffect(() => {
    if (!mounted) return;

    const cssPath = `/themes/${themeVariant}.css`;
    const linkId = "theme-variant-css";

    // Remove existing theme CSS link
    const existingLink = document.getElementById(linkId);
    if (existingLink) {
      existingLink.remove();
    }

    // Create and append new theme CSS link
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = cssPath;
    document.head.appendChild(link);

    // Set data-theme attribute for CSS selectors
    document.documentElement.setAttribute("data-theme", themeVariant);
  }, [themeVariant, mounted]);

  const setThemeVariant = useCallback((variant: ThemeVariant) => {
    setThemeVariantInternal(variant);
  }, []);

  const setColorMode = useCallback(
    (mode: ColorMode) => {
      setTheme(mode);
    },
    [setTheme]
  );

  const value: ThemeContextValue = {
    themeVariant,
    setThemeVariant,
    colorMode: (theme as ColorMode) ?? "system",
    setColorMode,
    resolvedColorMode: (resolvedTheme as "light" | "dark") ?? "light",
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Props for the ThemeProvider component.
 * @see ThemeProvider
 */
export interface ThemeProviderProps {
  /** Child components to wrap with theme context */
  children: ReactNode;
  /** Default theme variant (default: "convergence") */
  defaultVariant?: ThemeVariant;
  /** Default color mode (default: "system") */
  defaultColorMode?: ColorMode;
  /** Disable CSS transitions during theme changes (default: true) */
  disableTransitionOnChange?: boolean;
}

/**
 * Theme provider component that manages theme variants and color modes.
 *
 * @description Wraps the application to provide theme context. Combines a custom
 * theme variant system (convergence/synthwave) with next-themes for light/dark mode.
 * Persists theme preference to localStorage and loads theme CSS dynamically.
 *
 * @param props - Component props
 * @param props.children - Child components to wrap with theme context
 * @param props.defaultVariant - Default theme variant (default: "convergence")
 * @param props.defaultColorMode - Default color mode (default: "system")
 * @param props.disableTransitionOnChange - Disable CSS transitions during theme changes (default: true)
 * @returns Provider component wrapping children
 *
 * @example
 * ```tsx
 * // In your layout or app root
 * <ThemeProvider defaultVariant="convergence" defaultColorMode="system">
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @example
 * ```tsx
 * // In a child component
 * const { themeVariant, setThemeVariant } = useTheme();
 * ```
 *
 * @see useTheme
 * @see ThemeProviderProps
 */
export function ThemeProvider({
  children,
  defaultVariant = "convergence",
  defaultColorMode = "system",
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultColorMode}
      enableSystem
      disableTransitionOnChange={disableTransitionOnChange}
    >
      <ThemeVariantProvider defaultVariant={defaultVariant}>
        {children}
      </ThemeVariantProvider>
    </NextThemesProvider>
  );
}

/**
 * Hook to access the theme context.
 *
 * @description Provides access to theme state and setter functions.
 * Must be used within a ThemeProvider.
 *
 * @returns Theme context value with current state and setters
 * @throws {Error} If used outside of ThemeProvider
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { themeVariant, setThemeVariant, mounted } = useTheme();
 *
 *   if (!mounted) return <Skeleton />;
 *
 *   return (
 *     <button onClick={() => setThemeVariant(
 *       themeVariant === 'convergence' ? 'synthwave' : 'convergence'
 *     )}>
 *       Current: {themeVariant}
 *     </button>
 *   );
 * }
 * ```
 *
 * @see ThemeProvider
 * @see ThemeContextValue
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Resets the theme state for testing purposes.
 * @internal
 * @param defaultVariant - Default variant to reset to
 */
export function resetThemeState(defaultVariant: ThemeVariant = "convergence"): void {
  currentThemeVariant = defaultVariant;
  isMounted = false;
  themeVariantListeners = [];
  mountedListeners = [];

  // Re-trigger mounted state in test environment
  if (typeof window !== "undefined") {
    queueMicrotask(() => {
      isMounted = true;
      mountedListeners.forEach((listener) => listener());
    });
  }
}
