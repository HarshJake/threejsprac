import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: resolve(__dirname, "../static/"),
  base: resolve(__dirname, "/"),
  server: {
    host: true,
    hmr: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
