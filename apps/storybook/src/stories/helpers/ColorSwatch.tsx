import { useState, useCallback } from "react";

interface ColorSwatchProps {
  readonly name: string;
  readonly color: string;
  readonly textColor?: string;
  readonly size?: "sm" | "md" | "lg";
}

/**
 * A single color swatch that displays a color with its name. Clicking copies
 * the color value to clipboard.
 */
export function ColorSwatch({
  name,
  color,
  textColor = "white",
  size = "md",
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API not available
    }
  }, [color]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${sizeClasses[size]} rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border border-white/20 backdrop-blur-sm`}
      style={{ backgroundColor: color }}
      title={`Click to copy: ${color}`}
    >
      <span
        className="text-xs font-medium opacity-90"
        style={{ color: textColor }}
      >
        {copied ? "Copied!" : name}
      </span>
      <span
        className="text-[10px] font-mono opacity-70"
        style={{ color: textColor }}
      >
        {color}
      </span>
    </button>
  );
}

ColorSwatch.displayName = "ColorSwatch";

interface ColorSwatchGroupProps {
  readonly title: string;
  readonly colors: Array<{
    name: string;
    color: string;
    textColor?: string;
  }>;
  readonly size?: "sm" | "md" | "lg";
}

/** A group of color swatches with a title. */
export function ColorSwatchGroup({
  title,
  colors,
  size = "md",
}: ColorSwatchGroupProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-current opacity-80">{title}</h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((c) => (
          <ColorSwatch key={c.name} {...c} size={size} />
        ))}
      </div>
    </div>
  );
}

ColorSwatchGroup.displayName = "ColorSwatchGroup";
