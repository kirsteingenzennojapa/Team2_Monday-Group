import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",   // <-- tell Vite to use src as root
  server: {
    port: 3000,
  },
  build: {
    outDir: "../dist",
  },
});
