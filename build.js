import * as esbuild from 'esbuild';
import * as fs from 'fs';

const out = esbuild.buildSync({
  entryPoints: ['src/polyfill.js'],
  bundle: true,
  format: 'esm',
  banner: {
    js: `(function(scope) {'use strict';`,
  },
  footer: {
    js: `}(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this)));`,
  },
  platform: 'neutral',
  sourcemap: 'external',
  outfile: 'text.min.js',
  target: 'es5',
  minify: true,
});

// confirm it imports
await import('./text.min.js');

const stat = fs.statSync('text.min.js');
console.info(`text.min.js: ${stat.size}`);
