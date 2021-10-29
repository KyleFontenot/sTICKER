import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";

module.exports = {
  plugins: [solidPlugin(), solidSvg()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
};
