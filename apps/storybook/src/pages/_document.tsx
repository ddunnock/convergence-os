import { Html, Head, Main, NextScript } from "next/document";

/**
 * Custom Document component for Next.js. Augments the application's HTML and
 * Body tags.
 *
 * @returns The custom document structure
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
