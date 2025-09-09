import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Common for all files
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: ["dist/**", "node_modules/**"], // Ignore build/output
  },

  // JS files (CommonJS support)
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
  },

  // TS files
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: globals.node,
    },
  },

  // Special override for migrate-mongo-config.js
  {
    files: ["migrate-mongo-config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },

  // ESLint Recommended rules
  pluginJs.configs.recommended,

  // TypeScript ESLint recommended rules
  ...tseslint.configs.recommended,

  // Disable rules conflicting with Prettier
  prettier,
];
