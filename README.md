# ConvergenceOS

<p align="center">
  <strong>A Unified Knowledge Workspace</strong><br>
  <em>Bringing together notes, documentation, and communication</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#development">Development</a> •
  <a href="#packages">Packages</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## Overview

ConvergenceOS is a personal knowledge operating system where notes, documentation, and communication converge. Every piece of information is a node in your knowledge graph—linkable, searchable, and augmented by AI that understands your context.

Modern knowledge work is fragmented across disconnected tools. We take notes in one application, reference documentation in browsers, manage email in another client, and attempt to maintain coherence through manual copying and linking. ConvergenceOS unifies these domains into a single, interconnected environment.

## Features

### Core Capabilities

- **📝 Unified Note-Taking** — Markdown-based editor with wiki-style linking, block references, and rich formatting
- **📚 Documentation Integration** — Sync and browse external documentation from GitHub repositories (Markdown, MDX, RST)
- **📧 Email Integration** — IMAP-based email client unified with your knowledge graph
- **🔗 Knowledge Graph** — Bidirectional links, backlinks, and graph visualization
- **🔍 Unified Search** — Full-text and semantic search across all content types
- **🤖 AI Augmentation** — Summarization, draft generation, and intelligent suggestions powered by Claude and GPT-4

### Design Principles

- **Local-First** — Your data lives on your machine by default. Sync is a feature, not a requirement.
- **Document-Agnostic** — All content types (notes, docs, email) are treated as documents with metadata.
- **Links as First-Class Citizens** — Every addressable unit has a stable identifier that survives moves and renames.
- **AI as Augmentation** — AI assists but never modifies content without explicit user action.
- **Extensibility by Design** — Plugin architecture for new content types, sync targets, and AI capabilities.

## Architecture

ConvergenceOS is built as a **pnpm monorepo** with Turborepo for build orchestration. The architecture separates concerns into distinct packages while enabling code sharing across web and desktop applications.

```
convergence-os/
├── apps/
│   ├── web/                 # Next.js 15 web application
│   ├── desktop/             # Tauri 2.0 desktop application
│   └── docs/                # Documentation site
├── packages/
│   ├── types/               # Zod schemas & TypeScript types
│   ├── db/                  # Drizzle ORM & SQLite/PostgreSQL
│   ├── ai/                  # Anthropic & OpenAI integration
│   ├── editor/              # Tiptap editor & extensions
│   ├── ui/                  # shadcn/ui components
│   ├── core/                # Business logic
│   ├── sync/                # GitHub, IMAP sync providers
│   └── search/              # Search indexing
└── tooling/
    ├── typescript/          # Shared TypeScript configs
    ├── eslint/              # Shared ESLint configs
    └── tailwind/            # Shared Tailwind config
```

### Technology Stack


| Layer           | Technology              | Purpose                                            |
| --------------- | ----------------------- | -------------------------------------------------- |
| Package Manager | pnpm                    | Efficient disk usage, strict dependency resolution |
| Build System    | Turborepo               | Intelligent caching, parallel builds               |
| Desktop Shell   | Tauri 2.0               | Native performance, small footprint                |
| Web Framework   | Next.js 15              | App Router, Server Components                      |
| Editor          | Tiptap (ProseMirror)    | Extensible rich text editing                       |
| UI Components   | shadcn/ui               | Accessible, composable components                  |
| Data Layer      | Drizzle ORM             | Type-safe database access                          |
| AI Integration  | Anthropic + OpenAI SDKs | Claude and GPT-4 support                           |
| Validation      | Zod                     | Runtime validation with TypeScript inference       |

## Getting Started

### Prerequisites

- **Node.js** >= 25.0.0
- **pnpm** >= 10.24.0
- **Rust** (for Tauri desktop app)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/convergence-os.git
cd convergence-os

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI Providers
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=./data/convergence.db

# Optional: Remote sync
GITHUB_TOKEN=ghp_...
```

## Development

### Available Scripts


| Command          | Description                                 |
| ---------------- | ------------------------------------------- |
| `pnpm dev`       | Start all apps in development mode          |
| `pnpm build`     | Build all packages and applications         |
| `pnpm typecheck` | Run TypeScript type checking                |
| `pnpm lint`      | Run ESLint across all packages              |
| `pnpm test`      | Run tests across all packages               |
| `pnpm clean`     | Remove build artifacts and node_modules     |
| `pnpm format`    | Format code with Prettier                   |
| `pnpm db:studio` | Open Drizzle Studio for database inspection |

### Running Specific Apps

```bash
# Web app only
pnpm --filter @convergence/web dev

# Desktop app only
pnpm --filter @convergence/desktop dev

# Build specific package
pnpm --filter @convergence/ui build
```

### Adding Dependencies

```bash
# Add to a specific package
pnpm --filter @convergence/editor add @tiptap/extension-mention

# Add dev dependency
pnpm --filter @convergence/ui add -D @types/react

# Add workspace dependency
pnpm --filter @convergence/editor add @convergence/types@workspace:*

# Add to root (workspace tools)
pnpm add -Dw prettier-plugin-tailwindcss
```

### Adding UI Components

The UI package uses shadcn/ui. Add components with:

```bash
cd packages/ui
pnpm ui:add button dialog command popover
```

## Packages

### `@convergence/types`

Zod schemas defining the unified document model. All TypeScript types are derived from these schemas, ensuring runtime validation matches compile-time types.

```typescript
import { DocumentSchema, type Document } from "@convergence/types";

const doc = DocumentSchema.parse(rawData);
```

### `@convergence/db`

Drizzle ORM configuration with SQLite (local) and PostgreSQL (cloud) support. Includes schema definitions, migrations, and query utilities.

```typescript
import { createDatabase } from "@convergence/db";
import { documents } from "@convergence/db/schema";

const db = createDatabase();
const docs = await db.select().from(documents);
```

### `@convergence/ai`

Unified interface for AI providers with streaming support, tool use, and structured outputs.

```typescript
import { AnthropicProvider } from "@convergence/ai/providers";

const ai = new AnthropicProvider();
const response = await ai.complete([
  { role: "user", content: "Summarize this document..." }
]);

// Streaming
for await (const chunk of ai.stream(messages)) {
  process.stdout.write(chunk);
}
```

### `@convergence/editor`

Tiptap-based editor with custom extensions for wiki-links, block references, callouts, and more.

```tsx
import { ConvergenceEditor } from "@convergence/editor";

<ConvergenceEditor
  content={markdown}
  onChange={setContent}
  placeholder="Start writing..."
/>
```

### `@convergence/ui`

shadcn/ui components plus custom components for document management, sidebars, and command palette.

```tsx
import { Button } from "@convergence/ui";
import { cn } from "@convergence/ui/lib/utils";

<Button variant="outline" className={cn("custom-class")}>
  Click me
</Button>
```

## Editor Configuration

### VS Code

Recommended extensions are defined in `.vscode/extensions.json`. Install them for the best development experience:

- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Tailwind CSS IntelliSense** — `bradlc.vscode-tailwindcss`
- **Turborepo LSP** — `Vercel.turbo-vsc`
- **Tauri** — `tauri-apps.tauri-vscode`
- **Vitest** — `vitest.explorer`

### MCP Integration

ConvergenceOS supports the shadcn MCP server for AI-assisted component installation:

```json
// .mcp/shadcn.json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/shadcn-mcp-server@latest"],
      "env": {
        "SHADCN_CWD": "${workspaceFolder}/packages/ui"
      }
    }
  }
}
```

## Testing

### Unit & Integration Tests

Tests use Vitest with workspace configuration:

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @convergence/core test

# Watch mode
pnpm --filter @convergence/core test -- --watch

# Coverage
pnpm --filter @convergence/core test -- --coverage
```

### E2E Tests

End-to-end tests use Playwright:

```bash
cd apps/web
pnpm test:e2e
```

## Roadmap

### Phase 1: Foundation ✅

- [X]  Monorepo setup with pnpm + Turborepo
- [X]  TypeScript configurations
- [X]  Unified document model (Zod schemas)
- [X]  Database schema (Drizzle + SQLite)
- [X]  AI provider abstraction

### Phase 2: Core Editor (In Progress)

- [ ]  Tiptap editor with StarterKit
- [ ]  WikiLink extension (`[[page]]` syntax)
- [ ]  Block reference extension (`((block-id))`)
- [ ]  Full-text search (SQLite FTS5)
- [ ]  Document sidebar and navigation

### Phase 3: External Documentation

- [ ]  GitHub sync provider
- [ ]  Markdown/MDX parsing
- [ ]  RST support (via pandoc)
- [ ]  Documentation browser

### Phase 4: Email Integration

- [ ]  IMAP client integration
- [ ]  Thread view and composition
- [ ]  Email-to-note linking
- [ ]  Real-time updates (IMAP IDLE)

### Phase 5: AI Intelligence

- [ ]  Document summarization
- [ ]  Semantic search (embeddings)
- [ ]  Draft generation
- [ ]  Auto-tagging and suggestions

### Phase 6: Polish

- [ ]  Performance optimization
- [ ]  Desktop app refinement
- [ ]  Documentation site
- [ ]  MCP server for external AI tools

## Contributing

This is currently a personal learning project, but contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **TypeScript** — Strict mode enabled, no `any` types
- **Formatting** — Prettier with default config
- **Linting** — ESLint with turbo plugin for env var detection
- **Commits** — Conventional commits preferred

## License

MIT License — see [LICENSE](LICENSE) for details.

## Acknowledgments

ConvergenceOS builds on the shoulders of giants:

- [Tiptap](https://tiptap.dev/) / [ProseMirror](https://prosemirror.net/) — Editor foundation
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Drizzle ORM](https://orm.drizzle.team/) — Database toolkit
- [Turborepo](https://turborepo.com/) — Build system
- [Tauri](https://tauri.app/) — Desktop framework
- [Anthropic](https://anthropic.com/) / [OpenAI](https://openai.com/) — AI capabilities

---

<p align="center">
  <em>Built with curiosity and caffeine ☕</em>
</p>
