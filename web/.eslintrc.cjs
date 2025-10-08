module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "unused-imports"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": ["warn"],
    "unused-imports/no-unused-imports": "error",
    "import/order": [
      "warn",
      {
        "alphabetize": { order: "asc", caseInsensitive: true },
        "groups": ["builtin", "external", "internal", ["parent", "sibling", "index"]],
        "newlines-between": "always"
      }
    ]
  }
};

