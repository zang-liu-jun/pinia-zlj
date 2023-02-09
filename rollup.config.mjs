import path from "path"
import serve from "rollup-plugin-serve"
import { terser } from "rollup-plugin-minification"
import ts from "rollup-plugin-typescript2"
import dts from 'rollup-plugin-dts';

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default [{
  input: "./src/index.ts",
  output: {
    format: "esm",
    file: path.resolve(__dirname, "dist/bundle.js")
  },
  plugins: [
    ts(),
    terser()
  ]
}, {
  input: "./src/index.ts",
  plugins: [dts()],
  output: {
    format: "esm",
    file: path.resolve(__dirname, "dist/bundle.d.ts")
  }
}]