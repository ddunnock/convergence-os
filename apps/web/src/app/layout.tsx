/**
 * @fileoverview Root layout component for the Convergence OS web application.
 * Sets up fonts, metadata, and theme provider for the entire application.
 * @module @convergence/web/app/layout
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@convergence/ui/providers";
import "./globals.css";

/**
 * Geist Sans font configuration.
 * @description Primary sans-serif font for the application.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist Mono font configuration.
 * @description Monospace font for code and technical content.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Application metadata for SEO and browser display.
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: "Convergence OS",
  description: "Your personal knowledge operating system",
};

/**
 * Root layout component that wraps all pages in the application.
 *
 * @description Provides the HTML document structure, font configuration,
 * and theme context for the entire application. Includes an inline script
 * to prevent flash of unstyled content (FOUC) during initial page load.
 *
 * @param props - Component props
 * @param props.children - Child page content to render
 * @returns Root HTML document structure
 *
 * @example
 * ```tsx
 * // This is automatically used by Next.js for all pages
 * // in the app directory
 * ```
 *
 * @see ThemeProvider
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC by setting initial theme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var variant = localStorage.getItem('convergence-theme-variant') || 'convergence';
                  document.documentElement.setAttribute('data-theme', variant);
                  var link = document.createElement('link');
                  link.id = 'theme-variant-css';
                  link.rel = 'stylesheet';
                  link.href = '/themes/' + variant + '.css';
                  document.head.appendChild(link);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultVariant="convergence" defaultColorMode="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
