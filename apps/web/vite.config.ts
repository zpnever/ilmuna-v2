import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const srcRoot = fileURLToPath(new URL("./src", import.meta.url));
const routesDirectory = fileURLToPath(new URL("./src/routes", import.meta.url));
const generatedRouteTree = fileURLToPath(new URL("./src/app/routeTree.gen.ts", import.meta.url));
const vitestSetup = fileURLToPath(new URL("./src/test/setup.ts", import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory,
      generatedRouteTree,
      quoteStyle: "double",
    }),
    react(),
  ],
  root: projectRoot,
  resolve: {
    alias: {
      "@": srcRoot,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: vitestSetup,
    css: true,
    exclude: ["e2e/**", "node_modules/**"],
  },
});
