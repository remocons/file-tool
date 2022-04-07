import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default [
  {
    input: './src/file-tool.js',
    output: [
      { file: pkg.cjs, format: 'cjs' },
      { file: pkg.esm, format: 'es' }
    ],
  	plugins: [resolve(), commonjs(),terser()]
  }
]
