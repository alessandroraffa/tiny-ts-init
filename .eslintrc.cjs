/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    es2024: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  overrides: [
    {
      files: ["*.ts"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
    },
  ],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-floating-promises": "error",
  },
};
