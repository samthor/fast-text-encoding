#!/usr/bin/env node --max-old-space-size=8192

const {performance} = require('perf_hooks');
const chalk = require('chalk');
const fs = require('fs');

const packages = ['fast-text-encoding', 'text-encoding', 'text-encoding-polyfill', 'text-encoding-utf-8', 'fastestsmallesttextencoderdecoder'];
const runs = 8;

function buildRandomString(length) {
  const parts = [];
  for (let i = 0; i < length; ++i) {
    const v = 1.0 - Math.pow(Math.random(), 0.25);  // bias towards start
    parts.push(Math.floor(v * 0x10FFFF));
  }
  return String.fromCodePoint(...parts);
}

let string;

if (+process.argv[2] || process.argv.length < 3) {
  // possibly a number
  string = buildRandomString(+process.argv[2] || (256 * 256));
  console.info(`compare (random): length=${chalk.yellow(string.length)}`);
} else {
  const stat = fs.statSync(process.argv[2]);
  string = fs.readFileSync(process.argv[2], 'utf-8');
  const ratio = (string.length / stat.size);
  console.info(`compare (file): length=${chalk.yellow(string.length)}, bytes=${chalk.yellow(stat.size)} (ratio=${chalk.yellow(ratio.toFixed(2))})`);
}

// remove 'text-encoding-utf-8' after a certain size as it's just pathologically bad
if (string.length >= 32768) {
  const index = packages.indexOf('text-encoding-utf-8');
  packages.splice(index, 1);
}

console.info('');

function run(use, s) {
  const te = new use.TextEncoder('utf-8');
  const data = te.encode(s);

  const td = new use.TextDecoder('utf-8');
  const outs = td.decode(data);

  return outs.length;
}

function shuffle(arr) {
  const out = [];
  while (arr.length) {
    const choice = Math.floor(Math.random() * arr.length);
    out.push(arr.splice(choice, 1)[0]);
  }
  arr.push(...out);
}

const results = [];
const impl = {};
const hasNative = (global.TextEncoder && global.TextDecoder)
const nativeImpl = hasNative ? {TextEncoder: global.TextEncoder, TextDecoder: global.TextDecoder} : null;

for (const name of packages) {
  delete global.TextDecoder;
  delete global.TextEncoder;
  const exports = require(name);
  const use = {TextEncoder: global.TextEncoder, TextDecoder: global.TextDecoder, ...exports};

  if (hasNative && ((use.TextDecoder === nativeImpl.TextDecoder || use.TextEncoder === nativeImpl.TextEncoder))) {
    throw new Error(`package ${name} used native code`);
  }

  impl[name] = use;
}

if (hasNative) {
  packages.push('.native');
  impl['.native'] = nativeImpl;
}

(async function() {

  for (let i = 0; i < runs; ++i) {
    shuffle(packages);
    console.info('run', (i + 1));
  
    for (const name of packages) {
      delete global.TextDecoder;
      delete global.TextEncoder;
  
      console.debug(chalk.gray(name));
      const use = impl[name];
  
      const start = performance.now();
      const length = run(use, string);
      const duration = performance.now() - start;
      results.push({name, duration, length});

      // take a breather
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  results.sort(({duration: a}, {duration: b}) => a - b);

  for (const {name, duration, length} of results) {
    console.info((duration.toFixed(4) + 'ms').padStart(11), chalk.green(name), length !== string.length ? chalk.red(length) : '');
  }

})();
