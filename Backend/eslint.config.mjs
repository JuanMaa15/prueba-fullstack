// @ts-check
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["node_modules/", "src/generated/"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
);
