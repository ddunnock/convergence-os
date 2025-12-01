import { describe, it, expect, vi } from "vitest";
import Document from "../../pages/_document";
import * as ReactDOMServer from "react-dom/server";

// Mock next/document components for server-side rendering
vi.mock("next/document", () => ({
  Html: ({ children, lang }: { children: React.ReactNode; lang?: string }) => (
    <html lang={lang}>{children}</html>
  ),
  Head: () => <head />,
  Main: () => <div id="__next" />,
  NextScript: () => <script />,
}));

describe("Document", () => {
  it("exports a Document component", () => {
    expect(Document).toBeDefined();
    expect(typeof Document).toBe("function");
  });

  it("renders with correct HTML structure", () => {
    const html = ReactDOMServer.renderToString(<Document />);
    expect(html).toContain('lang="en"');
    expect(html).toContain("antialiased");
    expect(html).toContain("__next");
  });
});
