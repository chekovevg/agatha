import path from "node:path";
import {configDefaults, defineConfig} from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: [
      ...configDefaults.exclude,
      ".superpowers/**",
      "tests/e2e/**",
    ],
  },
});
