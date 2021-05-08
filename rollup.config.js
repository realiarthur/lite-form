import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
//import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

//const env = JSON.stringify(!process.env.ROLLUP_WATCH ? 'production' : 'development');

export default [
  {
    input: 'src/index.ts',

    output: [
      {
        dir: 'dist/',
        format: 'esm',
      },
    ],

    plugins: [
      resolve(),
      typescript({}),
      //terser(),
    ],

    external: [/lodash/]
  },
  {
    input: 'examples/index.js',

    output: {
      file: 'examples/bundle.js',
      format: 'umd',
    },

    plugins: [
      resolve(),
      postcss(),
      serve({
        contentBase: ['examples'],
        port: 3000,
      })
    ],
  },
  
  
  
  
];
