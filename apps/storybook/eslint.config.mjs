import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import storybookConfig from "@convergence/eslint-config/storybook";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...storybookConfig,
  {
    ignores: [".next/**", "out/**", "build/**", "storybook-static/**"],
  },
  {
    files: ["src/__tests__/**/*.{ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-head-element": "off",
    },
  }
);
