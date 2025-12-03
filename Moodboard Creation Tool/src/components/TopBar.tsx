import { Search, Menu, Settings, HardDrive } from "lucide-react";
import { useEmailStore } from "./emailStore";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  const { searchQuery, setSearchQuery } = useEmailStore();

  return (
    <div className="glass-strong rounded-b-2xl p-4">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
            <Menu className="glow-primary" size={20} />
          </div>
          <h1 className="glow-primary tracking-wider">AURORAMAIL</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass rounded-xl pl-12 pr-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{ color: "var(--input-text)" }}
            />
          </div>
        </div>

        {/* Storage */}
        <div
          className="glass rounded-xl px-4 py-2 flex items-center gap-3"
          title="Storage: 10.2 GB of 15 GB used"
        >
          <HardDrive className="text-indigo-600" size={18} />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span style={{ color: "var(--text-tertiary)" }}>68%</span>
            </div>
            <div
              className="w-24 h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--progress-track)" }}
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Settings */}
        <button className="glass-button rounded-xl p-3 hover:scale-105 transition-transform">
          <Settings className="glow-accent" size={20} />
        </button>
      </div>
    </div>
  );
}
