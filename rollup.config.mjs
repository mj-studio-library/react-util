/* eslint-disable @typescript-eslint/no-var-requires */
// const babel = require('@rollup/plugin-babel');
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
// import * as postcss from 'rollup-plugin-postcss';
import ts from 'rollup-plugin-typescript2';

export default [
  {
    input: 'index.ts',
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        interop: 'auto',
      },
      // {
      //   dir: 'esm',
      //   format: 'esm',
      //   interop: 'auto',
      //   preserveModules: false,
      //   // preserveModulesRoot: 'src',
      // },
    ],
    plugins: [
      nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
      commonjs(),
      peerDepsExternal(),
      // postcss(),
      // babel({
      //   extensions: ['.ts', '.tsx', '.js', '.jsx'],
      //   babelHelpers: 'bundled',
      //   rootMode: 'upward',
      //   presets: [
      //     [
      //       '@babel/preset-react',
      //       {
      //         runtime: 'automatic',
      //       },
      //     ],
      //   ],
      // }),
      ts({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
  },
];
