/* eslint-disable import/no-extraneous-dependencies */
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import pkg from './package.json'

const input = 'src/index.js'
const name = 'loadable'
const globals = {
  react: 'React',
  'hoist-non-react-statics': 'hoistNonReactStatics',
}

const external = id => !id.startsWith('.') && !id.startsWith('/')

const babelOptions = {
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
  presets: [
    ['@babel/preset-env', { loose: true }],
    ['@babel/preset-react', { useBuiltIns: true }],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    'babel-plugin-annotate-pure-calls',
    '@babel/plugin-transform-runtime',
  ],
}

export default [
  // umd
  {
    input,
    output: {
      file: `dist/loadable.js`,
      format: 'umd',
      name,
      globals,
      exports: 'named',
      sourcemap: false,
    },
    external: Object.keys(globals),
    plugins: [
      babel(babelOptions),
      nodeResolve(),
      commonjs(),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    ],
  },
  // min
  {
    input,
    output: {
      file: 'dist/loadable.min.js',
      format: 'umd',
      name,
      globals,
      exports: 'named',
      sourcemap: false,
    },
    external: Object.keys(globals),
    plugins: [
      babel(babelOptions),
      nodeResolve(),
      commonjs(),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      terser(),
    ],
  },
  // cjs
  {
    input,
    output: { file: pkg.main, format: 'cjs', exports: 'named' },
    external,
    plugins: [babel(babelOptions), sizeSnapshot()],
  },
  // esm
  {
    input,
    output: { file: pkg.module, format: 'esm' },
    external,
    plugins: [babel(babelOptions), sizeSnapshot()],
  },
]
