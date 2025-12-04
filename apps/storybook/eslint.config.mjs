import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import storybookConfig from "@convergence/eslint-config/storybook";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname =
  typeof __dirname === "undefined"
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname;

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...storybookConfig,
  {
    ignores: [".next/**", "out/**", "build/**", "storybook-static/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ["src/__tests__/**/*.{ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-head-element": "off",
    },
  }
);
