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
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <span className="text-sm font-medium text-slate-500 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
          v{version}
        </span>
      </div>
    </div>
  );
}

Introduction.displayName = "Introduction";
