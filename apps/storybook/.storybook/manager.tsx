import { addons } from "storybook/manager-api";
import { themes } from "@storybook/theming";

/**
 * Get custom theme configuration with brand logo.
 *
 * @param _themeId - Theme ID ('light' or 'dark')
 * @returns Custom theme configuration object
 */
function getCustomTheme(_themeId: "light" | "dark" = "light") {
  return {
    brandImage: "./logo.png",
    brandTitle: "Convergence UI",
    brandUrl: "./",
  };
}

// Use light theme as default (can be extended to support theme switching)
const themeId: "light" | "dark" = "light";

addons.setConfig({
  theme: {
    ...themes[themeId],
    ...getCustomTheme(themeId),
  },
});
