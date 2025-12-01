import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import { ThemeProvider } from "../src/context/ThemeContext";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
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
  },
  decorators: [
    (Story) =>
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(Story, null)
      ),
  ],
};

export default preview;
