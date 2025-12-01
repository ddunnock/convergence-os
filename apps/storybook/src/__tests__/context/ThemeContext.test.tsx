import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";

afterEach(() => {
  cleanup();
});

/** Test component that consumes the theme context. */
function TestConsumer() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
    </div>
  );
}

describe("ThemeContext", () => {
  describe("ThemeProvider", () => {
    it("renders children correctly", () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Child content</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("sets data-theme attribute to light by default", () => {
      const { container } = render(
        <ThemeProvider>
          <div>Content</div>
        </ThemeProvider>
      );

      const wrapper = container.querySelector("[data-theme]");
      expect(wrapper).toHaveAttribute("data-theme", "light");
    });

    it("provides theme context to children", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
    });

    it("updates theme when setTheme is called", () => {
      const { container } = render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme-value")).toHaveTextContent("light");

      fireEvent.click(screen.getByText("Set Dark"));

      expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
      const wrapper = container.querySelector("[data-theme]");
      expect(wrapper).toHaveAttribute("data-theme", "dark");
    });

    it("can switch theme back to light", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText("Set Dark"));
      expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");

      fireEvent.click(screen.getByText("Set Light"));
      expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
    });
  });

  describe("useTheme", () => {
    it("throws error when used outside ThemeProvider", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => render(<TestConsumer />)).toThrow(
        "useTheme must be used within ThemeProvider"
      );

      consoleSpy.mockRestore();
    });

    it("returns theme and setTheme function", () => {
      let capturedContext: { theme: string; setTheme: unknown } | null = null;

      function ContextCapture() {
        capturedContext = useTheme();
        return null;
      }

      render(
        <ThemeProvider>
          <ContextCapture />
        </ThemeProvider>
      );

      expect(capturedContext).not.toBeNull();
      expect(capturedContext?.theme).toBe("light");
      expect(typeof capturedContext?.setTheme).toBe("function");
    });
  });
});
