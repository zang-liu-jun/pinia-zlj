import path from "path"
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
    file: path.resolve(__dirname, "dist/bundle.mjs")
  },
  plugins: [
    ts(),	// 转化ts
    terser() //压缩代码
  ]
}, {
  input: "./src/index.ts",
  output: {
    format: "cjs",
    file: path.resolve(__dirname, "dist/bundle.cjs")
  },
  plugins: [
    ts(),	// 转化ts
    terser() //压缩代码
  ]
}, {
  input: "./src/index.ts",
  plugins: [dts()],// 生成d.ts文件
  output: {
    format: "esm",
    file: path.resolve(__dirname, "dist/bundle.d.ts")
  }
}]