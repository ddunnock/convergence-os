/**
 * @module @convergence/test-utils
 * @file Main exports for @convergence/test-utils package. Provides testing
 *   utilities, render wrappers, and re-exports from testing libraries.
 */

import * as React from "react";
import { type ReactElement, type ReactNode } from "react";
import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";

// Re-export everything from testing libraries
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export * from "vitest";

// Re-export our utilities
export * from "./mocks.js";
export * from "./chaos.js";

/** Options for custom render wrapper. */
export interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  /** Custom wrapper components in order of nesting (outermost first) */
  wrappers?: Array<React.ComponentType<{ children: ReactNode }>>;
}

/**
 * Creates a combined wrapper from multiple provider components.
 *
 * Combines multiple wrapper components into a single wrapper, useful for
 * testing with multiple context providers.
 *
 * @example
 *   ```typescript
 *   const CombinedWrapper = createCombinedWrapper([
 *     ThemeProvider,
 *     AuthProvider,
 *     QueryProvider,
 *   ]);
 *   render(<Component />, { wrapper: CombinedWrapper });
 *   ```;
 *
 * @param wrappers - Array of wrapper components, outermost first
 * @returns Combined wrapper component
 */
export function createCombinedWrapper(
  wrappers: Array<React.ComponentType<{ children: ReactNode }>>
): React.ComponentType<{ children: ReactNode }> {
  return function CombinedWrapper({ children }: { children: ReactNode }) {
    return wrappers.reduceRight(
      (acc, Wrapper) => React.createElement(Wrapper, null, acc),
      children
    ) as ReactElement;
  };
}

/**
 * Custom render function with support for multiple wrappers.
 *
 * Extends @testing-library/react's render with support for composing multiple
 * wrapper components.
 *
 * @example
 *   ```typescript
 *   const { getByText } = customRender(<MyComponent />, {
 *     wrappers: [ThemeProvider, AuthProvider],
 *   });
 *   ```;
 *
 * @param ui - The React element to render
 * @param options - Render options including custom wrappers
 * @returns Render result with query methods
 */
export function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { wrappers = [], ...renderOptions } = options;

  if (wrappers.length > 0) {
    const Wrapper = createCombinedWrapper(wrappers);
    return render(ui, { wrapper: Wrapper, ...renderOptions });
  }

  return render(ui, renderOptions);
}

/**
 * Creates a test setup helper with preconfigured wrappers.
 *
 * Factory function to create a render function with default wrappers already
 * applied, reducing boilerplate in tests.
 *
 * @example
 *   ```typescript
 *   // In test setup
 *   const renderWithProviders = createTestSetup([ThemeProvider]);
 *
 *   // In tests
 *   const { getByRole } = renderWithProviders(<Button />);
 *   ```;
 *
 * @param defaultWrappers - Default wrapper components
 * @returns Custom render function
 */
export function createTestSetup(
  defaultWrappers: Array<React.ComponentType<{ children: ReactNode }>>
): (
  ui: ReactElement,
  options?: Omit<CustomRenderOptions, "wrappers">
) => RenderResult {
  return (ui, options = {}) =>
    customRender(ui, { ...options, wrappers: defaultWrappers });
}

/**
 * Waits for a condition to be true with timeout.
 *
 * Utility for waiting on async state changes in tests.
 *
 * @example
 *   ```typescript
 *   await waitForCondition(() => document.querySelector('.loaded'));
 *   ```;
 *
 * @param condition - Function that returns true when condition is met
 * @param options - Timeout and interval options
 * @returns Promise that resolves when condition is true
 * @throws Error if timeout is reached
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout = 5000, interval = 50 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) return;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Creates a mock console that captures and optionally suppresses output.
 *
 * Useful for testing error boundaries or components that log errors/warnings.
 *
 * @example
 *   ```typescript
 *   const { errors, restore } = mockConsole({ suppress: true });
 *   render(<ComponentThatLogErrors />);
 *   expect(errors).toHaveLength(1);
 *   restore();
 *   ```;
 *
 * @param options - Configuration options
 * @returns Object with captured logs and restore function
 */
export function mockConsole(options: { suppress?: boolean } = {}): {
  logs: string[];
  warnings: string[];
  errors: string[];
  restore: () => void;
} {
  const { suppress = false } = options;
  const logs: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
    if (!suppress) originalLog(...args);
  };

  console.warn = (...args: unknown[]) => {
    warnings.push(args.map(String).join(" "));
    if (!suppress) originalWarn(...args);
  };

  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
    if (!suppress) originalError(...args);
  };

  return {
    logs,
    warnings,
    errors,
    restore: () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    },
  };
}

/**
 * Asserts that no accessibility violations exist.
 *
 * Simple accessibility check for testing. For comprehensive a11y testing, use
 * axe-core.
 *
 * @example
 *   ```typescript
 *   const { container } = render(<Button>Click me</Button>);
 *   assertNoA11yViolations(container);
 *   ```;
 *
 * @param container - DOM container to check
 * @throws Error if accessibility issues are found
 */
export function assertNoA11yViolations(container: HTMLElement): void {
  // Check for images without alt text
  const imagesWithoutAlt = container.querySelectorAll("img:not([alt])");
  if (imagesWithoutAlt.length > 0) {
    throw new Error(
      `Found ${imagesWithoutAlt.length} image(s) without alt text`
    );
  }

  // Check for buttons without accessible names
  const buttons = container.querySelectorAll("button");
  buttons.forEach((button) => {
    const hasAccessibleName =
      button.textContent?.trim() ||
      button.getAttribute("aria-label") ||
      button.getAttribute("aria-labelledby") ||
      button.getAttribute("title");
    if (!hasAccessibleName) {
      throw new Error("Found button without accessible name");
    }
  });

  // Check for form inputs without labels
  const inputs = container.querySelectorAll(
    "input:not([type='hidden']), select, textarea"
  );
  inputs.forEach((input) => {
    const id = input.getAttribute("id");
    const hasLabel =
      input.getAttribute("aria-label") ||
      input.getAttribute("aria-labelledby") ||
      (id && container.querySelector(`label[for="${id}"]`)) ||
      input.closest("label");
    if (!hasLabel) {
      throw new Error(
        `Found form input without associated label: ${input.outerHTML.slice(0, 100)}`
      );
    }
  });

  // Check for proper heading hierarchy
  const headings = Array.from(
    container.querySelectorAll("h1, h2, h3, h4, h5, h6")
  );
  let lastLevel = 0;
  headings.forEach((heading) => {
    const levelChar = heading.tagName[1];
    const level = levelChar ? Number.parseInt(levelChar, 10) : 1;
    if (level > lastLevel + 1 && lastLevel !== 0) {
      console.warn(
        `Heading hierarchy skip: h${lastLevel} to h${level}. Consider using proper heading levels.`
      );
    }
    lastLevel = level;
  });
}
