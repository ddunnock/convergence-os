import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactConfig from "@convergence/eslint-config/react";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...reactConfig,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  }
);
