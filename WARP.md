# ConvergenceOS - Warp AI Development Guide

## Project Overview

ConvergenceOS is a personal knowledge operating system built as a pnpm monorepo where notes, documentation, and communication converge. This is a local-first, document-agnostic platform with AI augmentation.

**Tech Stack:**
- **Package Manager:** pnpm 10.24.0+
- **Build System:** Turborepo
- **Desktop:** Tauri 2.0
- **Web:** Next.js 15 (App Router)
- **UI:** shadcn/ui + Radix UI + Tailwind CSS
- **Database:** Drizzle ORM (SQLite/PostgreSQL)
- **AI:** Anthropic (Claude) + OpenAI (GPT-4)
- **ML Service:** Python 3.12+ (FastAPI, sentence-transformers, spaCy)
- **Testing:** Vitest (unit/integration), Playwright (e2e), pytest (Python)
- **Documentation:** Sphinx (RST) + TypeDoc (JSDoc)

## Architecture

```
convergence-os/
├── apps/
│   ├── web/                 # Next.js 15 web application
│   └── desktop/             # Tauri 2.0 desktop (future)
├── packages/
│   ├── types/               # Zod schemas & TypeScript types
│   ├── db/                  # Drizzle ORM & database
│   ├── ai/                  # AI provider integrations
│   ├── editor/              # Tiptap editor
│   ├── ui/                  # shadcn/ui components
│   ├── core/                # Business logic
│   ├── sync/                # Sync providers
│   ├── search/              # Search indexing
│   └── test-utils/          # Shared test utilities
├── services/
│   └── ml/                  # Python ML service (FastAPI)
├── tooling/
│   ├── typescript/          # Shared TS configs
│   ├── eslint/              # Shared ESLint configs
│   ├── tailwind/            # Shared Tailwind config
│   └── prettier/            # Shared Prettier config
└── docs/                    # Sphinx documentation (RST)
```

## Development Environment

### Prerequisites

```bash
# Required
node >= 25.0.0
pnpm >= 10.24.0

# Optional (for specific features)
rust >= 1.70          # Tauri desktop app
python >= 3.12        # ML service
```

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
pnpm db:migrate

# Start development
pnpm dev              # All apps
pnpm dev:web          # Web only
```

### Environment Variables

Required in `.env.local`:

```env
# AI Providers
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=./data/convergence.db

# Optional: Remote sync
GITHUB_TOKEN=ghp_...
```

## Code Standards

### TypeScript

- **Strict mode enabled** - No `any` types (explicit rule)
- **JSDoc-style comments** for all exported functions, components, and types
- **Use `@fileoverview`** at the top of every file to describe its purpose
- **Module annotations:** `@module @convergence/package/path`
- **Comprehensive documentation:** Include `@param`, `@returns`, `@example`, `@see`

#### JSDoc Example

```typescript
/**
 * @fileoverview Button component with variant and size support.
 * Provides a flexible button component using class-variance-authority.
 * @module @convergence/ui/components/ui/button
 */

/**
 * Creates button variant styles using class-variance-authority.
 * @description Defines all available button variants and sizes.
 *
 * @returns CVA function for generating button class names
 *
 * @example
 * ```typescript
 * const classes = buttonVariants({ variant: "default", size: "lg" });
 * ```
 *
 * @see {@link https://cva.style/docs class-variance-authority}
 */
const buttonVariants = cva(...)

/**
 * Button component with variant and size support.
 *
 * @param props - Button component props
 * @param props.variant - Visual variant style (default: "default")
 * @param props.size - Size variant (default: "default")
 * @param props.className - Additional CSS classes
 * @param props.asChild - If true, renders as child component using Radix Slot
 * @returns React button component
 *
 * @example
 * ```tsx
 * <Button variant="destructive" size="sm">Delete</Button>
 * ```
 */
function Button({ variant, size, ...props }) { ... }
```

### Python

- **Type hints required** - Use mypy strict mode
- **Docstring format:** Google-style or NumPy-style docstrings
- **Module-level docstrings** for all files

#### Python Docstring Example

```python
"""
Application configuration using Pydantic Settings.

Configuration is loaded from environment variables with optional .env support.
"""

class EmbeddingGenerator:
    """
    Generate embeddings with context-aware weighting.
    """

    def embed_with_context(
        self,
        focal_text: str,
        context: str,
        focal_weight: float = 0.7,
    ) -> list[float]:
        """
        Generate embedding with weighted context.

        The focal text (e.g., highlighted text) is weighted more heavily
        than the surrounding context.
        """
```

### Formatting

- **Prettier** - Default config for TypeScript/JavaScript/JSON/Markdown
- **Ruff** - Python formatting and linting (line length: 100)
- **Pre-commit hooks** - Husky + lint-staged for automatic formatting

### Component Standards

- **Use shadcn/ui patterns** - Composition over configuration
- **Theme integration** - Use CSS custom properties (`bg-background`, `text-foreground`)
- **No hardcoded colors** - Always use theme tokens
- **Accessibility** - Proper ARIA attributes, semantic HTML
- **data-slot attributes** - All components should have `data-slot="component-name"`

## Testing Standards

### Unit & Integration Tests (Vitest)

**Location:** `packages/*/src/**/*.test.{ts,tsx}`

**Structure:** Comprehensive test categories following established patterns:

```typescript
/**
 * @fileoverview Comprehensive tests for ComponentName component.
 * Includes unit, edge case, security, performance, and chaos tests.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ComponentName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Unit Tests", () => {
    it("renders with default props", () => { ... });
    it("applies variant classes correctly", () => { ... });
    it("handles events", async () => { ... });
  });

  describe("Edge Cases", () => {
    it("handles undefined/null props", () => { ... });
    it("handles empty children", () => { ... });
    it("handles very long className strings", () => { ... });
    it("handles all variant combinations", () => { ... });
  });

  describe("Security Tests", () => {
    it("prevents XSS in className prop", () => { ... });
    it("sanitizes user-provided input", () => { ... });
    it("prevents prototype pollution", () => { ... });
  });

  describe("Performance Tests", () => {
    it("does not cause excessive re-renders", () => { ... });
    it("batches rapid prop changes", () => { ... });
    it("handles many instances efficiently", () => { ... });
  });

  describe("Chaos Tests", () => {
    it("handles rapid prop changes (100+ times)", () => { ... });
    it("handles concurrent renders", () => { ... });
    it("handles rapid mount/unmount cycles", () => { ... });
  });

  describe("Integration Tests", () => {
    it("works within forms", () => { ... });
    it("works with keyboard navigation", () => { ... });
    it("works with screen readers", () => { ... });
  });
});
```

**Coverage Requirements:**
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

**Run Tests:**

```bash
pnpm test                              # All tests
pnpm --filter @convergence/ui test     # Specific package
pnpm test -- --watch                   # Watch mode
pnpm test -- --coverage                # With coverage
```

### E2E Tests (Playwright)

**Location:** `apps/web/e2e/*.spec.ts`

**Structure:**

```typescript
/**
 * @fileoverview E2E tests for UI components.
 * Tests component behavior in a real browser environment.
 */

import { test, expect, type Page } from "@playwright/test";

test.describe("ComponentName E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Visual Appearance", () => {
    test("renders correctly", async ({ page }) => { ... });
  });

  test.describe("Interaction", () => {
    test("handles user clicks", async ({ page }) => { ... });
    test("handles keyboard navigation", async ({ page }) => { ... });
  });

  test.describe("Accessibility", () => {
    test("has proper aria attributes", async ({ page }) => { ... });
    test("focus is managed correctly", async ({ page }) => { ... });
  });

  test.describe("Mobile Responsiveness", () => {
    test("works on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      // Test mobile-specific behavior
    });
  });
});
```

**Run E2E Tests:**

```bash
cd apps/web
pnpm test:e2e                # Run e2e tests
pnpm playwright test --ui    # Interactive mode
pnpm playwright test --debug # Debug mode
```

### Python Tests (pytest)

**Location:** `services/ml/tests/**/*.py`

**Configuration:** `pyproject.toml` with pytest, pytest-asyncio, pytest-cov

**Run Tests:**

```bash
pnpm ml:test              # Run Python tests
pnpm ml:test:watch        # Watch mode
```

### Integration Tests

**Location:** `packages/*/src/__tests__/integration/*.test.tsx`

**Purpose:** Test multiple components working together (e.g., ThemeProvider + ThemeSwitcher)

```typescript
/**
 * @fileoverview Integration tests for theme system components.
 * Tests ThemeProvider and ThemeSwitcher component interactions.
 */

describe("Theme System Integration", () => {
  describe("ThemeProvider + ThemeSwitcher Integration", () => {
    it("changes propagate across components", async () => { ... });
    it("multiple instances stay synchronized", async () => { ... });
    it("persists across remounts", async () => { ... });
  });
});
```

## Documentation Standards

### Sphinx Documentation (RST)

**Location:** `docs/`

**Structure:** Diátaxis framework (tutorials, how-to, reference, explanation)

```
docs/
├── conf.py                 # Sphinx configuration
├── index.rst               # Main documentation entry
├── tutorials/              # Learning-oriented
│   ├── index.rst
│   └── getting-started.rst
├── how-to/                 # Goal-oriented
│   └── index.rst
├── reference/              # Information-oriented
│   └── index.rst
└── explanation/            # Understanding-oriented
    ├── index.rst
    └── architecture.rst
```

**Build Documentation:**

```bash
pnpm docs:build    # Build HTML docs
pnpm docs:serve    # Serve locally (port 8000)
```

**Sphinx Configuration Highlights:**

- **Theme:** Furo (modern, clean)
- **Extensions:** sphinx_js, autodoc, viewcode, intersphinx, sphinx_design
- **JSDoc Integration:** TypeDoc via sphinx-js
- **TypeScript Support:** Automatic API documentation from JSDoc comments

### TypeDoc API Documentation

**Configuration:** `typedoc.json`

- **Entry points:** All packages and apps
- **Output:** `docs/_build/typedoc`
- **Excludes:** Tests, node_modules, dist
- **Validation:** Enforces documented exports

**Generate:**

```bash
npx typedoc
```

### RST Documentation Guidelines

```rst
Component Name
==============

.. note::

   This is a note for important information.

*Brief description of the component.*

Usage
-----

.. code-block:: typescript

   import { Component } from "@convergence/ui";

   <Component variant="default" />

API Reference
-------------

See the :doc:`/reference/index` for detailed API documentation.
```

## Workflow Commands

### Development

```bash
pnpm dev              # Start all apps
pnpm dev:web          # Web only
pnpm build            # Build all
pnpm typecheck        # TypeScript check
pnpm lint             # ESLint
pnpm lint:fix         # Fix linting issues
pnpm format           # Prettier format
pnpm format:check     # Check formatting
pnpm clean            # Clean build artifacts
```

### Database

```bash
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio
```

### ML Service

```bash
pnpm ml:dev           # Start dev server with reload
pnpm ml:serve         # Start production server
pnpm ml:worker        # Start worker process
pnpm ml:test          # Run tests
pnpm ml:test:watch    # Watch mode
pnpm ml:lint          # Ruff check
pnpm ml:lint:fix      # Fix lint issues
pnpm ml:format        # Format code
pnpm ml:typecheck     # mypy type checking
pnpm ml:models:download  # Download ML models
pnpm ml:models:list      # List cached models
```

### Package-Specific

```bash
# Run command in specific package
pnpm --filter @convergence/ui <command>

# Examples
pnpm --filter @convergence/ui test
pnpm --filter @convergence/ui build
pnpm --filter @convergence/ui typecheck

# Add UI components (shadcn)
cd packages/ui
pnpm ui:add button dialog command
```

## Adding Dependencies

```bash
# Add to specific package
pnpm --filter @convergence/editor add @tiptap/extension-mention

# Add dev dependency
pnpm --filter @convergence/ui add -D @types/react

# Add workspace dependency
pnpm --filter @convergence/editor add @convergence/types@workspace:*

# Add to root (workspace tools only)
pnpm add -Dw prettier-plugin-tailwindcss
```

## Git Workflow

### Commit Standards

- **Conventional commits preferred**
- **Pre-commit hooks** - Run lint-staged automatically

Example commit messages:

```
feat(ui): add new theme switcher component
fix(db): resolve migration race condition
docs(readme): update installation instructions
test(ui): add comprehensive button tests
refactor(editor): simplify link extension
```

### Branching

```
main              # Production-ready code
feature/xyz       # New features
fix/xyz           # Bug fixes
refactor/xyz      # Code refactoring
docs/xyz          # Documentation updates
```

## Project-Specific Patterns

### Theme System

- **CSS Variables:** All components use CSS custom properties
- **Dark Mode:** Managed by `next-themes` with custom theme variants
- **Theme Variants:** `convergence` (default), `synthwave`
- **Color Tokens:** Use `bg-background`, `text-foreground`, `border-border`, etc.

### Component Patterns

```tsx
// Always use composition via Radix Slot
import { Slot } from "@radix-ui/react-slot";

function Component({ asChild = false, ...props }) {
  const Comp = asChild ? Slot : "div";
  return <Comp data-slot="component-name" {...props} />;
}

// Always add data-slot for testing
<Component data-slot="unique-identifier" />

// Use cn() for className merging
import { cn } from "@/lib/utils";

className={cn("base-classes", variantClasses, className)}
```

### Database Patterns

```typescript
// Use Drizzle ORM with Zod schemas
import { DocumentSchema } from "@convergence/types";
import { documents } from "@convergence/db/schema";

const doc = DocumentSchema.parse(rawData);
const result = await db.insert(documents).values(doc);
```

### AI Integration Patterns

```typescript
// Unified AI provider interface
import { AnthropicProvider } from "@convergence/ai/providers";

const ai = new AnthropicProvider();
const response = await ai.complete(messages);

// Streaming support
for await (const chunk of ai.stream(messages)) {
  process.stdout.write(chunk);
}
```

## Troubleshooting

### Common Issues

**Node version mismatch:**

```bash
node -v  # Should be >= 25.0.0
nvm use 25  # Or install correct version
```

**pnpm cache issues:**

```bash
pnpm store prune
pnpm install --force
```

**Type errors after package updates:**

```bash
pnpm clean
pnpm install
pnpm typecheck
```

**Playwright browser issues:**

```bash
cd apps/web
pnpm playwright install
```

**Python ML service:**

```bash
cd services/ml
poetry install
poetry run convergence-ml serve
```

## CI/CD

### GitHub Actions

Located in `.github/workflows/`

**Key workflows:**
- Lint and typecheck on PR
- Run tests on PR
- Build verification
- E2E tests on main branches

### Turborepo Caching

- **Remote caching** configured via `turbo.jsonc`
- **Task dependencies** defined (e.g., `build` depends on `^build`)
- **Environment variables** properly scoped to avoid cache poisoning

## Resources

### External Documentation

- [Next.js](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Turborepo](https://turborepo.com/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Sphinx](https://www.sphinx-doc.org/)
- [TypeDoc](https://typedoc.org/)

### Internal Resources

- **Main README:** `/README.md` - Project overview and quick start
- **Sphinx Docs:** `/docs/` - Comprehensive documentation
- **API Reference:** Auto-generated from JSDoc comments
- **Architecture:** `/docs/explanation/architecture.rst`

## Philosophy

1. **Local-First** - Your data lives on your machine by default
2. **Document-Agnostic** - All content types are treated as documents
3. **Links as First-Class Citizens** - Stable identifiers survive moves/renames
4. **AI as Augmentation** - AI assists but never modifies without permission
5. **Extensibility by Design** - Plugin architecture for new capabilities

---

**Last Updated:** 2024-11-30

**Project Status:** Phase 2 (Core Editor) - In Progress

**Maintainer:** ConvergenceOS Team
