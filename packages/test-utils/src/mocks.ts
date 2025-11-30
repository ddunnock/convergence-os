/**
 * @fileoverview Shared mock implementations for testing React components.
 * Provides configurable mocks for browser APIs commonly needed in tests.
 * @module @convergence/test-utils/mocks
 */

import { vi, type Mock } from "vitest";

/**
 * Configuration options for localStorage mock behavior.
 */
export interface LocalStorageMockOptions {
  /** Initial data to populate the mock storage */
  initialData?: Record<string, string>;
  /** Whether to throw errors on operations */
  shouldThrow?: boolean;
  /** Simulate quota exceeded errors */
  quotaExceeded?: boolean;
}

/**
 * Creates a configurable localStorage mock.
 *
 * @description Provides a fully mockable localStorage implementation that can
 * simulate various edge cases like quota exceeded errors and storage failures.
 *
 * @param options - Configuration options for the mock
 * @returns Object containing the mock and control functions
 *
 * @example
 * ```typescript
 * const { mock, getData, reset } = createLocalStorageMock({
 *   initialData: { theme: 'dark' }
 * });
 * Object.defineProperty(window, 'localStorage', { value: mock });
 * ```
 */
export function createLocalStorageMock(options: LocalStorageMockOptions = {}) {
  let data: Record<string, string> = { ...options.initialData };
  let shouldThrow = options.shouldThrow ?? false;
  let quotaExceeded = options.quotaExceeded ?? false;

  const mock = {
    getItem: vi.fn((key: string): string | null => {
      if (shouldThrow) throw new Error("localStorage access denied");
      return data[key] ?? null;
    }),
    setItem: vi.fn((key: string, value: string): void => {
      if (shouldThrow) throw new Error("localStorage access denied");
      if (quotaExceeded) {
        const error = new Error("QuotaExceededError");
        error.name = "QuotaExceededError";
        throw error;
      }
      data[key] = value;
    }),
    removeItem: vi.fn((key: string): void => {
      if (shouldThrow) throw new Error("localStorage access denied");
      delete data[key];
    }),
    clear: vi.fn((): void => {
      if (shouldThrow) throw new Error("localStorage access denied");
      data = {};
    }),
    get length(): number {
      return Object.keys(data).length;
    },
    key: vi.fn((index: number): string | null => {
      const keys = Object.keys(data);
      return keys[index] ?? null;
    }),
  };

  return {
    mock,
    /** Get the current stored data */
    getData: () => ({ ...data }),
    /** Reset to initial state */
    reset: () => {
      data = { ...options.initialData };
      shouldThrow = options.shouldThrow ?? false;
      quotaExceeded = options.quotaExceeded ?? false;
      vi.clearAllMocks();
    },
    /** Enable error throwing mode */
    enableErrors: () => {
      shouldThrow = true;
    },
    /** Disable error throwing mode */
    disableErrors: () => {
      shouldThrow = false;
    },
    /** Enable quota exceeded simulation */
    enableQuotaExceeded: () => {
      quotaExceeded = true;
    },
    /** Disable quota exceeded simulation */
    disableQuotaExceeded: () => {
      quotaExceeded = false;
    },
  };
}

/**
 * Configuration for matchMedia mock.
 */
export interface MatchMediaMockOptions {
  /** Whether the media query matches by default */
  matches?: boolean;
  /** Specific queries and their match states */
  queryMatches?: Record<string, boolean>;
}

/**
 * Creates a configurable matchMedia mock.
 *
 * @description Provides a mockable window.matchMedia implementation for testing
 * responsive designs and color scheme preferences.
 *
 * @param options - Configuration options
 * @returns Object containing the mock and control functions
 *
 * @example
 * ```typescript
 * const { mock, setMatches } = createMatchMediaMock({
 *   queryMatches: { '(prefers-color-scheme: dark)': true }
 * });
 * Object.defineProperty(window, 'matchMedia', { value: mock });
 * ```
 */
export function createMatchMediaMock(options: MatchMediaMockOptions = {}) {
  let defaultMatches = options.matches ?? false;
  const queryMatches: Record<string, boolean> = { ...options.queryMatches };
  const listeners: Map<string, Set<(event: MediaQueryListEvent) => void>> =
    new Map();

  const mock: Mock = vi.fn((query: string) => {
    const matches = queryMatches[query] ?? defaultMatches;
    const queryListeners = listeners.get(query) ?? new Set();
    listeners.set(query, queryListeners);

    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn((cb: (event: MediaQueryListEvent) => void) => {
        queryListeners.add(cb);
      }),
      removeListener: vi.fn((cb: (event: MediaQueryListEvent) => void) => {
        queryListeners.delete(cb);
      }),
      addEventListener: vi.fn(
        (
          _event: string,
          cb: (event: MediaQueryListEvent) => void
        ) => {
          queryListeners.add(cb);
        }
      ),
      removeEventListener: vi.fn(
        (
          _event: string,
          cb: (event: MediaQueryListEvent) => void
        ) => {
          queryListeners.delete(cb);
        }
      ),
      dispatchEvent: vi.fn(() => true),
    };
  });

  return {
    mock,
    /** Set match state for a specific query */
    setMatches: (query: string, matches: boolean) => {
      queryMatches[query] = matches;
      const queryListeners = listeners.get(query);
      if (queryListeners) {
        const event = { matches, media: query } as MediaQueryListEvent;
        queryListeners.forEach((cb) => cb(event));
      }
    },
    /** Set default match state */
    setDefaultMatches: (matches: boolean) => {
      defaultMatches = matches;
    },
    /** Reset to initial state */
    reset: () => {
      defaultMatches = options.matches ?? false;
      Object.keys(queryMatches).forEach((key) => delete queryMatches[key]);
      Object.assign(queryMatches, options.queryMatches);
      listeners.clear();
      mock.mockClear();
    },
  };
}

/**
 * Creates a ResizeObserver mock.
 *
 * @description Provides a mock ResizeObserver for testing components that use it,
 * such as Radix UI components.
 *
 * @returns The mock ResizeObserver class
 *
 * @example
 * ```typescript
 * global.ResizeObserver = createResizeObserverMock();
 * ```
 */
export function createResizeObserverMock() {
  return vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

/**
 * Creates an IntersectionObserver mock.
 *
 * @description Provides a mock IntersectionObserver for testing components
 * that use lazy loading or visibility detection.
 *
 * @returns The mock IntersectionObserver class
 */
export function createIntersectionObserverMock() {
  return vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(() => []),
  }));
}

/**
 * Creates a mock for Element.prototype.scrollIntoView.
 *
 * @returns The mock function
 */
export function createScrollIntoViewMock(): Mock {
  return vi.fn();
}

/**
 * Mock implementation for next/navigation.
 *
 * @description Provides mock implementations for Next.js navigation hooks.
 */
export const nextNavigationMock = {
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
};

/**
 * Applies all standard mocks to the global/window object.
 *
 * @description Convenience function to set up all common mocks at once.
 * Typically called in test setup files.
 *
 * @returns Object containing all mock controls
 *
 * @example
 * ```typescript
 * // In test-setup.ts
 * const mocks = applyGlobalMocks();
 * afterEach(() => mocks.resetAll());
 * ```
 */
export function applyGlobalMocks() {
  const localStorage = createLocalStorageMock();
  const matchMedia = createMatchMediaMock();
  const resizeObserver = createResizeObserverMock();
  const intersectionObserver = createIntersectionObserverMock();
  const scrollIntoView = createScrollIntoViewMock();

  Object.defineProperty(window, "localStorage", { value: localStorage.mock });
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: matchMedia.mock,
  });
  global.ResizeObserver = resizeObserver;
  global.IntersectionObserver = intersectionObserver;
  Element.prototype.scrollIntoView = scrollIntoView;

  return {
    localStorage,
    matchMedia,
    resizeObserver,
    intersectionObserver,
    scrollIntoView,
    resetAll: () => {
      localStorage.reset();
      matchMedia.reset();
      resizeObserver.mockClear();
      intersectionObserver.mockClear();
      scrollIntoView.mockClear();
    },
  };
}
