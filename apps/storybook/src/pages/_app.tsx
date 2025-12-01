import "@/styles/globals.css";
import type { AppProps } from "next/app";

/**
 * Custom App component for Next.js. Wraps all pages with global styles and
 * providers.
 *
 * @param props - App component props
 * @param props.Component - The active page component
 * @param props.pageProps - Props passed to the page component
 * @returns The wrapped page component
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
