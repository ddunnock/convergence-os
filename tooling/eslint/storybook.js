import nextjsConfig from "./nextjs.js";
import storybookPlugin from "eslint-plugin-storybook";

/**
 * ESLint configuration for Storybook applications Extends Next.js config with
 * Storybook-specific rules
 */
export default [
  ...nextjsConfig,
  ...storybookPlugin.configs["flat/recommended"],
];
