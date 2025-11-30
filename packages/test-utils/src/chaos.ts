/**
 * @fileoverview Chaos testing utilities for stress testing React components.
 * Provides tools for fuzzing, race conditions, and failure simulation.
 * @module @convergence/test-utils/chaos
 */

import { vi } from "vitest";

/**
 * Executes a function rapidly multiple times.
 *
 * @description Useful for testing components under rapid state changes,
 * simulating user mashing buttons or rapid theme switching.
 *
 * @param fn - The function to execute
 * @param count - Number of times to execute (default: 1000)
 * @param intervalMs - Delay between executions in ms (default: 0)
 * @returns Promise that resolves when all executions complete
 *
 * @example
 * ```typescript
 * await rapidFire(() => setTheme('dark'), 1000, 0);
 * expect(renderCount).toBeLessThan(10); // Should batch updates
 * ```
 */
export async function rapidFire(
  fn: () => void | Promise<void>,
  count = 1000,
  intervalMs = 0
): Promise<void> {
  const promises: Promise<void>[] = [];

  for (let i = 0; i < count; i++) {
    const promise = Promise.resolve(fn());
    promises.push(promise);

    if (intervalMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  await Promise.all(promises);
}

/**
 * Returns a promise that resolves after a random delay.
 *
 * @description Useful for simulating network latency or async operations
 * with unpredictable timing.
 *
 * @param minMs - Minimum delay in milliseconds
 * @param maxMs - Maximum delay in milliseconds
 * @returns Promise that resolves after the random delay
 *
 * @example
 * ```typescript
 * await randomDelay(10, 100);
 * ```
 */
export function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Creates a large DOM tree to simulate memory pressure.
 *
 * @description Useful for testing component behavior under memory-constrained
 * conditions, such as theme switching with a complex DOM.
 *
 * @param nodeCount - Number of nodes to create (default: 10000)
 * @returns Cleanup function to remove the created nodes
 *
 * @example
 * ```typescript
 * const cleanup = simulateMemoryPressure(50000);
 * // Run your tests
 * await switchTheme();
 * cleanup();
 * ```
 */
export function simulateMemoryPressure(nodeCount = 10000): () => void {
  const container = document.createElement("div");
  container.id = "chaos-memory-pressure";
  container.style.display = "none";

  for (let i = 0; i < nodeCount; i++) {
    const node = document.createElement("div");
    node.className = `pressure-node-${i}`;
    node.textContent = `Node ${i}`;
    node.setAttribute("data-index", String(i));
    container.appendChild(node);
  }

  document.body.appendChild(container);

  return () => {
    container.remove();
  };
}

/**
 * Corrupts localStorage data for a specific key.
 *
 * @description Tests how components handle invalid or corrupted stored data.
 *
 * @param key - The localStorage key to corrupt
 * @param corruptionType - Type of corruption to apply
 *
 * @example
 * ```typescript
 * corruptLocalStorage('theme-variant', 'invalid-json');
 * // Component should gracefully fall back to default
 * ```
 */
export function corruptLocalStorage(
  key: string,
  corruptionType:
    | "invalid-json"
    | "wrong-type"
    | "xss-attempt"
    | "overflow"
    | "null-bytes" = "invalid-json"
): void {
  const corruptions: Record<string, string> = {
    "invalid-json": "{invalid json",
    "wrong-type": "42",
    "xss-attempt": '<script>alert("xss")</script>',
    overflow: "x".repeat(1024 * 1024), // 1MB string
    "null-bytes": "theme\x00variant",
  };

  localStorage.setItem(key, corruptions[corruptionType]);
}

/**
 * Creates a mock that simulates storage quota exceeded errors.
 *
 * @description Tests graceful handling of storage full scenarios.
 *
 * @returns Object with enable/disable controls
 *
 * @example
 * ```typescript
 * const quota = simulateStorageQuotaExceeded();
 * quota.enable();
 * expect(() => localStorage.setItem('key', 'value')).toThrow();
 * quota.disable();
 * ```
 */
export function simulateStorageQuotaExceeded(): {
  enable: () => void;
  disable: () => void;
} {
  const originalSetItem = localStorage.setItem.bind(localStorage);
  let enabled = false;

  localStorage.setItem = vi.fn((key: string, value: string) => {
    if (enabled) {
      const error = new DOMException(
        "QuotaExceededError: The quota has been exceeded.",
        "QuotaExceededError"
      );
      throw error;
    }
    return originalSetItem(key, value);
  });

  return {
    enable: () => {
      enabled = true;
    },
    disable: () => {
      enabled = false;
    },
  };
}

/**
 * Generates random invalid values for fuzzing.
 *
 * @description Creates an array of random/invalid values to test
 * component robustness against unexpected inputs.
 *
 * @param validValues - Array of valid values to base fuzzing on
 * @param count - Number of fuzzed values to generate (default: 50)
 * @returns Array of fuzzed values
 *
 * @example
 * ```typescript
 * const fuzzed = fuzzer(['light', 'dark', 'system'], 100);
 * for (const value of fuzzed) {
 *   setTheme(value); // Should not crash
 * }
 * ```
 */
export function fuzzer<T>(validValues: T[], count = 50): unknown[] {
  const fuzzedValues: unknown[] = [];

  const generators = [
    // Null/undefined
    () => null,
    () => undefined,
    // Empty values
    () => "",
    () => [],
    () => ({}),
    // Numbers
    () => 0,
    () => -1,
    () => Infinity,
    () => -Infinity,
    () => NaN,
    () => Number.MAX_SAFE_INTEGER,
    () => Number.MIN_SAFE_INTEGER,
    // Strings
    () => " ",
    () => "\n\t",
    () => "null",
    () => "undefined",
    () => "true",
    () => "false",
    () => "<script>",
    () => "'; DROP TABLE users; --",
    () => "${7*7}",
    () => "{{constructor.constructor('return this')()}}",
    // Modified valid values
    () =>
      typeof validValues[0] === "string"
        ? validValues[0].toUpperCase()
        : validValues[0],
    () =>
      typeof validValues[0] === "string" ? ` ${validValues[0]} ` : validValues[0],
    () =>
      typeof validValues[0] === "string"
        ? validValues[0] + "\x00"
        : validValues[0],
    // Special objects
    () => new Date(),
    () => /regex/,
    () => Symbol("test"),
    () => new Map(),
    () => new Set(),
    () => new WeakMap(),
    () => new WeakSet(),
    // Functions
    () => () => {},
    () =>
      function* () {
        yield 1;
      },
    () => async () => {},
    // Proxy/prototype pollution attempts
    () => ({ __proto__: { polluted: true } }),
    () => ({ constructor: { prototype: { polluted: true } } }),
    // Long strings
    () => "a".repeat(10000),
    // Unicode
    () => "\u0000\u0001\u0002",
    () => "\uD800\uDFFF", // Surrogate pairs
    () => "🔥".repeat(100),
    // Array-like
    () => ({ length: 3, 0: "a", 1: "b", 2: "c" }),
    () => new Uint8Array([1, 2, 3]),
  ];

  for (let i = 0; i < count; i++) {
    const generator = generators[Math.floor(Math.random() * generators.length)];
    fuzzedValues.push(generator());
  }

  return fuzzedValues;
}

/**
 * Tests for race conditions in mount/unmount cycles.
 *
 * @description Rapidly mounts and unmounts components to detect race conditions
 * in cleanup logic or async operations.
 *
 * @param setup - Function to mount the component, returns cleanup function
 * @param iterations - Number of mount/unmount cycles (default: 100)
 * @param options - Additional options
 * @returns Promise that resolves when testing is complete
 *
 * @example
 * ```typescript
 * await raceConditionTester(
 *   () => {
 *     const { unmount } = render(<ThemeProvider><App /></ThemeProvider>);
 *     return unmount;
 *   },
 *   100,
 *   { maxConcurrent: 5 }
 * );
 * ```
 */
export async function raceConditionTester(
  setup: () => (() => void) | Promise<() => void>,
  iterations = 100,
  options: {
    maxConcurrent?: number;
    delayBetween?: number;
    randomDelay?: boolean;
  } = {}
): Promise<void> {
  const { maxConcurrent = 10, delayBetween = 0, randomDelay: useRandomDelay = false } = options;

  const running: Promise<void>[] = [];

  for (let i = 0; i < iterations; i++) {
    const run = async () => {
      const cleanup = await setup();
      if (useRandomDelay) {
        await randomDelay(0, 10);
      } else if (delayBetween > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayBetween));
      }
      cleanup();
    };

    running.push(run());

    if (running.length >= maxConcurrent) {
      await Promise.race(running);
      // Wait for all and clear
      await Promise.allSettled(running);
      running.length = 0;
    }
  }

  await Promise.all(running);
}

/**
 * Configuration for network failure simulation.
 */
export interface NetworkFailureOptions {
  /** Probability of failure (0-1) */
  failureProbability?: number;
  /** Delay before failure in ms */
  delayMs?: number;
  /** Error type to throw */
  errorType?: "timeout" | "network" | "abort" | "cors";
}

/**
 * Mocks fetch to simulate network failures for specific URL patterns.
 *
 * @description Tests component behavior when CSS or other resources fail to load.
 *
 * @param urlPattern - Regex or string pattern to match URLs
 * @param options - Failure configuration
 * @returns Cleanup function to restore original fetch
 *
 * @example
 * ```typescript
 * const restore = networkFailure(/\.css$/, {
 *   failureProbability: 0.5,
 *   errorType: 'network'
 * });
 * // Test theme CSS loading with intermittent failures
 * restore();
 * ```
 */
export function networkFailure(
  urlPattern: RegExp | string,
  options: NetworkFailureOptions = {}
): () => void {
  const { failureProbability = 1, delayMs = 0, errorType = "network" } = options;

  const originalFetch = global.fetch;
  const pattern =
    typeof urlPattern === "string" ? new RegExp(urlPattern) : urlPattern;

  global.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (pattern.test(url) && Math.random() < failureProbability) {
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      const errors: Record<string, Error> = {
        timeout: new DOMException("The operation timed out.", "TimeoutError"),
        network: new TypeError("Failed to fetch"),
        abort: new DOMException("The operation was aborted.", "AbortError"),
        cors: new TypeError("Failed to fetch (CORS)"),
      };

      throw errors[errorType];
    }

    return originalFetch(input, init);
  });

  return () => {
    global.fetch = originalFetch;
  };
}

/**
 * Simulates concurrent access from multiple "tabs".
 *
 * @description Tests storage event handling and synchronization between
 * simulated browser tabs.
 *
 * @param key - localStorage key to access
 * @param values - Values to write from different "tabs"
 * @param intervalMs - Interval between writes (default: 0)
 *
 * @example
 * ```typescript
 * await simulateConcurrentTabs('theme', ['dark', 'light', 'system']);
 * // Component should handle storage events correctly
 * ```
 */
export async function simulateConcurrentTabs(
  key: string,
  values: string[],
  intervalMs = 0
): Promise<void> {
  const storageEventPromises = values.map(async (value, index) => {
    if (intervalMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, index * intervalMs));
    }

    localStorage.setItem(key, value);

    // Dispatch storage event to simulate cross-tab communication
    const event = new StorageEvent("storage", {
      key,
      newValue: value,
      oldValue: localStorage.getItem(key),
      storageArea: localStorage,
      url: window.location.href,
    });

    window.dispatchEvent(event);
  });

  await Promise.all(storageEventPromises);
}

/**
 * Measures render performance during operations.
 *
 * @description Tracks render counts and timing to detect performance regressions.
 *
 * @returns Object with tracking functions
 *
 * @example
 * ```typescript
 * const perf = createPerformanceTracker();
 * const { rerender } = render(<Component onRender={perf.onRender} />);
 * await switchTheme();
 * expect(perf.getRenderCount()).toBeLessThan(5);
 * ```
 */
export function createPerformanceTracker(): {
  onRender: () => void;
  getRenderCount: () => number;
  getTiming: () => number[];
  reset: () => void;
  getAverageTime: () => number;
} {
  let renderCount = 0;
  const timings: number[] = [];
  let lastRenderTime = performance.now();

  return {
    onRender: () => {
      const now = performance.now();
      if (renderCount > 0) {
        timings.push(now - lastRenderTime);
      }
      lastRenderTime = now;
      renderCount++;
    },
    getRenderCount: () => renderCount,
    getTiming: () => [...timings],
    reset: () => {
      renderCount = 0;
      timings.length = 0;
      lastRenderTime = performance.now();
    },
    getAverageTime: () => {
      if (timings.length === 0) return 0;
      return timings.reduce((a, b) => a + b, 0) / timings.length;
    },
  };
}
