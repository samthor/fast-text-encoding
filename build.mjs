import * as esbuild from 'esbuild';
import * as fs from 'fs';

esbuild.buildSync({
  entryPoints: ['src/polyfill.js'],
  bundle: true,
  format: 'iife',
  platform: 'neutral',
  sourcemap: 'external',
  outfile: 'package/text.min.js',
  target: 'es5',
  minify: true,
});

// confirm it imports
await import('./package/text.min.js');

const stat = fs.statSync('./package/text.min.js');
console.info(`text.min.js: ${stat.size}`);

esbuild.buildSync({
  entryPoints: ['src/no-polyfill.js'],
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  sourcemap: 'external',
  outfile: 'package/no-polyfill.min.js',
  target: 'es5',
  minify: true,
});

const stat2 = fs.statSync('./package/no-polyfill.min.js');
console.info(`no-polyfill.min.js: ${stat2.size}`);
