import { Github } from "lucide-react";

/**
 * Introduction component for the Storybook welcome page. Displays the project
 * name, version, and links.
 */
export function Introduction() {
  const repository = "https://github.com/your-org/convergence-os";
  const version = "0.1.0";

  return (
    <div className="flex flex-wrap items-end justify-between gap-6 w-full">
      {/* Logo and Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Convergence UI
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          A modern React component library with glassmorphism design
        </p>
      </div>

      {/* Version and Links */}
      <div className="flex items-center gap-4">
        <a
          href={repository}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full transition-all duration-200 hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          aria-label="View on GitHub"
        >
          <Github className="w-6 h-6" />
        </a>
        <span className="text-sm font-medium text-slate-500 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
          v{version}
        </span>
      </div>
    </div>
  );
}

Introduction.displayName = "Introduction";
