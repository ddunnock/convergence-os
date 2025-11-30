import jsdocPlugin from "prettier-plugin-jsdoc";

/**
 * Prettier configuration with JSDoc plugin support
 * Compatible with TypeDoc for Sphinx documentation generation
 */
export default {
  plugins: [jsdocPlugin],
  // JSDoc-specific options
  jsdocPrintWidth: 80,
  jsdocSeparateReturns: false,
  jsdocSeparateTagGroups: false,
  jsdocDescriptionWithDot: false,
  jsdocPreferCodeFences: false,
  // Standard Prettier options
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
};

