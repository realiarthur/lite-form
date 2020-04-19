import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import external from '@yelo/rollup-node-external';

const config = {
  input: 'src/index.js',
  external: external(),
  output: {
    format: 'umd',
    name: 'lite-form',
    globals: {
      'lodash.set': 'set',
      'lodash.get': 'get',
      'lodash.clonedeep': 'clonedeep'
    },
  },
  plugins: [
    babel({
      runtimeHelpers: true,
      plugins: ["@babel/plugin-proposal-class-properties"],
    }),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  ]
}

export default config