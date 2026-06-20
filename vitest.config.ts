import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Unit-test config. Pure helpers only (no DOM needed) → node environment.
// Mirrors the tsconfig "@/*" → "./src/*" path alias so tests import like the app.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
