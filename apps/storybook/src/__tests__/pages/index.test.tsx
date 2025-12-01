import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import Home from "../../pages/index";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    alt,
    priority,
    ...props
  }: {
    alt: string;
    priority?: boolean;
    [key: string]: unknown;
  }) => <img alt={alt} data-priority={priority} {...props} />,
}));

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Geist: () => ({ className: "mock-geist-sans" }),
  Geist_Mono: () => ({ className: "mock-geist-mono" }),
}));

describe("Home", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the main element", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the Next.js logo", () => {
    render(<Home />);
    expect(screen.getByAltText("Next.js logo")).toBeInTheDocument();
  });

  it("renders the getting started heading", () => {
    render(<Home />);
    expect(
      screen.getByText(/To get started, edit the index.tsx file/)
    ).toBeInTheDocument();
  });

  it("renders deploy and documentation links", () => {
    render(<Home />);
    expect(screen.getByText("Deploy Now")).toBeInTheDocument();
    expect(screen.getByText("Documentation")).toBeInTheDocument();
  });
});
