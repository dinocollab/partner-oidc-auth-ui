import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import url from "@rollup/plugin-url";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const basePlugins = [
  url({
    include: ["**/*.webp", "**/*.png", "**/*.jpg"],
    limit: 8192,
    emitFiles: true,
    fileName: "[name][hash][extname]",
    destDir: "dist/assets",
  }),

  postcss({
    extract: true,
    minimize: true,
    sourceMap: true,
    include: /node_modules|src/,
  }),

  peerDepsExternal(),
  resolve({ extensions }),
  commonjs(),
  typescript({ tsconfig: "./tsconfig.json" }),
  babel({
    babelHelpers: "bundled",
    presets: [
      ["@babel/preset-env", { targets: "> 0.25%, not dead" }],
      ["@babel/preset-react", { runtime: "classic" }], // dùng JSX runtime cổ điển
      "@babel/preset-typescript",
    ],
    extensions,
    exclude: "node_modules/**",
  }),
  terser(),
];

export default [
  // 1. Bundle main code
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist",
        format: "esm",
        sourcemap: true,
        preserveModules: true,
        entryFileNames: "[name].js",
      },
    ],
    plugins: basePlugins,
    external: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-router",
      "@mui/material",
      "@mui/icons-material",
    ],
  },

  // 2. Bundle types
  {
    input: "./dist/types/index.d.ts",
    output: [{ file: "./dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
