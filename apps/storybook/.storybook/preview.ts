import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import "../src/styles/globals.css";

// Define orb colors explicitly to match the moodboard design
// Light mode: softer pastel colors
// Dark mode: vibrant indigo/purple/blue (from moodboard index.css)
const ORB_COLORS = {
  light: {
    orb1: "#818cf8", // More saturated indigo (indigo-400)
    orb2: "#a78bfa", // More saturated purple (purple-400)
    orb3: "#60a5fa", // More saturated blue (blue-400)
    opacity: 0.4, // Increased opacity for better visibility
  },
  dark: {
    orb1: "#6366f1", // Indigo-500
    orb2: "#a855f7", // Purple-500
    orb3: "#3b82f6", // Blue-500
    opacity: 0.2,
  },
};

/** Animated orb component for the background effect. */
function AnimatedOrb({
  color,
  size,
  position,
  delay,
  opacity,
}: {
  color: string;
  size: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay: string;
  opacity: number;
}) {
  return React.createElement("div", {
    style: {
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color,
      opacity: opacity,
      filter: "blur(60px)",
      animation: `pulse 4s ease-in-out infinite`,
      animationDelay: delay,
      mixBlendMode: "multiply",
      ...position,
    },
  });
}

/** Animated background component with floating orbs. */
function AnimatedBackground({ theme }: { theme: "light" | "dark" }) {
  const colors = ORB_COLORS[theme];
  return React.createElement(
    "div",
    {
      style: {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      },
    },
    // Orb 1 - top left
    React.createElement(AnimatedOrb, {
      color: colors.orb1,
      size: "300px",
      position: { top: "-50px", left: "-50px" },
      delay: "0s",
      opacity: colors.opacity,
    }),
    // Orb 2 - top right
    React.createElement(AnimatedOrb, {
      color: colors.orb2,
      size: "250px",
      position: { top: "20px", right: "-30px" },
      delay: "1.5s",
      opacity: colors.opacity,
    }),
    // Orb 3 - bottom center
    React.createElement(AnimatedOrb, {
      color: colors.orb3,
      size: "280px",
      position: { bottom: "-60px", left: "40%" },
      delay: "3s",
      opacity: colors.opacity,
    })
  );
}

/**
 * Theme wrapper component that applies the theme based on Storybook globals.
 * Uses data-theme attribute for CSS variable theming and includes animated
 * background. Supports both canvas (fullscreen) and docs (inline) view modes.
 */
function ThemeWrapper({
  children,
  theme,
  viewMode,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
  viewMode: string;
}) {
  const isDocsMode = viewMode === "docs";

  // Background gradients matching the moodboard design
  const lightGradient =
    "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f2f6ff 100%)";
  const darkGradient =
    "linear-gradient(135deg, #0f1419 0%, #1a1f35 50%, #0f1922 100%)";
  const backgroundGradient = theme === "dark" ? darkGradient : lightGradient;

  // For docs mode, use width/height 100% to fill the story container
  // For canvas mode, use absolute positioning for full-bleed effect
  const wrapperStyle: React.CSSProperties = isDocsMode
    ? {
        background: backgroundGradient,
        position: "relative",
        width: "100%",
        minHeight: "200px",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "background 0.3s ease-in-out",
      }
    : {
        background: backgroundGradient,
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        transition: "background 0.3s ease-in-out",
      };

  const contentStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: "1.5rem",
  };

  return React.createElement(
    "div",
    {
      "data-theme": "convergence",
      className: theme === "dark" ? "dark" : "",
      style: wrapperStyle,
    },
    // Animated background
    React.createElement(AnimatedBackground, { theme }),
    // Content container (above background)
    React.createElement("div", { style: contentStyle }, children)
  );
}

const preview: Preview = {
  parameters: {
    // Use "fullscreen" layout for full-bleed background
    layout: "fullscreen",
    controls: {
      expanded: true,
      sort: "requiredFirst",
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: { excludeDecorators: true },
    },
    options: {
      storySort: {
        order: ["Introduction", "Components", "Utilities"],
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    // Disable the default backgrounds addon since we use our own theme system
    backgrounds: { disable: true },
  },
  // Define the theme toggle in the toolbar
  globalTypes: {
    theme: {
      description: "Global theme for components",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  // Set the initial theme
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      // Get theme from globals (toolbar selection)
      const theme = context.globals.theme || "light";
      // Get view mode to adjust styling for docs vs canvas
      const viewMode = context.viewMode || "story";
      return React.createElement(ThemeWrapper, {
        theme,
        viewMode,
        children: React.createElement(Story, null),
      });
    },
  ],
};

export default preview;
