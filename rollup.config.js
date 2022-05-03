import { terser } from "rollup-plugin-terser";

export default [
	{
    input: 'fsm.js',
    output: {
      file: 'dist/fsm.cjs',
      format: 'cjs',
      exports: 'default'
    }
  },
  {
    input: 'fsm.js',
    output: {
      file: 'dist/fsm.esm.js',
      format: 'esm',
      esModule: true,
      exports: 'named',
      plugins: [terser()]
    }
  },
  {
    input: 'fsm.js',
    output: {
      file: 'dist/fsm.umd.js',
      format: 'umd',
      sourcemap: 'inline',
      name: 'Fsm',
      plugins: [terser()]
    }
  }
];