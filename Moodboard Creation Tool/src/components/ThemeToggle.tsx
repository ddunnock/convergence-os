import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("system");
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const getIcon = () => {
    if (theme === "light") return <Sun className="glow-accent" size={20} />;
    if (theme === "dark") return <Moon className="glow-accent" size={20} />;
    return <Monitor className="glow-accent" size={20} />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button rounded-xl p-3 hover:scale-105 transition-transform"
        aria-label="Toggle theme"
      >
        {getIcon()}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-40 glass-strong rounded-xl overflow-hidden z-50 shadow-lg">
            <button
              onClick={() => handleThemeChange("light")}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors ${
                theme === "light" ? "bg-white/10" : ""
              }`}
            >
              <Sun size={18} />
              <span className="text-sm">Light</span>
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors ${
                theme === "dark" ? "bg-white/10" : ""
              }`}
            >
              <Moon size={18} />
              <span className="text-sm">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors ${
                theme === "system" ? "bg-white/10" : ""
              }`}
            >
              <Monitor size={18} />
              <span className="text-sm">System</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
