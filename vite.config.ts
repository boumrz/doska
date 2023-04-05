import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import * as path from "path";

interface ViteConfigInput {
  mode: string;
  command: string;
}

export default (args: ViteConfigInput) => {
  const generateScopedName =
    args.mode === "production"
      ? "[hash:base64:5]"
      : "[name]__[local]__[hash:base64:5]";

  return defineConfig({
    plugins: [
      react(),
      svgr({
        exportAsDefault: true,
        include: "**/*.svg",
      }),
    ],
    server: {
      port: 3000,
      // Для запуска на сервере по wi-fi
      host: "192.168.1.5",
    },
    css: {
      modules: {
        localsConvention: "camelCase",
        generateScopedName,
      },
    },
    resolve: {
      alias: {
        "@/pages": path.resolve(__dirname, "./src/pages"),
        "@/hooks": path.resolve(__dirname, "./src/hooks"),
        "@/components": path.resolve(__dirname, "./src/components"),
        "@/assets": path.resolve(__dirname, "./src/assets"),
        "@/constants": path.resolve(__dirname, "./src/constants"),
      },
    },
  });
};
