#!/usr/bin/env node --max-old-space-size=8192

const {performance} = require('perf_hooks');
const chalk = require('chalk');
const fs = require('fs');
const mri = require('mri');

const options = mri(process.argv.slice(2), {
  default: {
    runs: 6,
    native: false,
  },
});

const packages = ['fast-text-encoding', 'text-encoding', 'text-encoding-polyfill', 'text-encoding-utf-8', 'fastestsmallesttextencoderdecoder'];

if (!options.native) {
  global.Buffer.from = () => {
    throw new Error('use of Buffer.from');
  };
  delete global.Buffer;
  console.warn('NOT including any native code...');

  if (global.TextEncoder && global.TextDecoder) {
    global.TextEncoder.prototype.encode = () => {
      throw new Error('use of native encode()');
    };
    global.TextDecoder.prototype.decode = () => {
      throw new Error('use of native decode()');
    };
  }
  delete global.TextEncoder;
  delete global.TextDecoder;
}

function buildRandomString(length) {
  const parts = [];
  for (let i = 0; i < length; ++i) {
    const v = 1.0 - Math.pow(Math.random(), 0.25);  // bias towards start
    parts.push(Math.floor(v * 0x10FFFF));
  }
  return String.fromCodePoint(...parts);
}

let string;

const firstArg = options._[0];
if (firstArg === undefined || +firstArg) {
  // possibly a number
  string = buildRandomString(+firstArg || (256 * 256));
  console.info(`compare (random): length=${chalk.yellow(string.length)}`);
} else {
  const stat = fs.statSync(firstArg);
  string = fs.readFileSync(firstArg, 'utf-8');
  const ratio = (string.length / stat.size);
  console.info(`compare (file): length=${chalk.yellow(string.length)}, bytes=${chalk.yellow(stat.size)} (ratio=${chalk.yellow(ratio.toFixed(2))})`);
}

// remove 'text-encoding-utf-8' after a certain size as it's just pathologically bad
if (string.length >= 32768) {
  const index = packages.indexOf('text-encoding-utf-8');
  if (index !== -1) {
    packages.splice(index, 1);
  }
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

do {
  delete global.TextDecoder;
  delete global.TextEncoder;

  try {
    require('../text.min.js');
    packages.push('.local');
    impl['.local'] = {TextEncoder: global.TextEncoder, TextDecoder: global.TextDecoder};
  } catch (e) {
    // ignore
  }
} while (false);

delete global.TextDecoder;
delete global.TextEncoder;


if (hasNative) {
  packages.push('.native');
  impl['.native'] = nativeImpl;
}

(async function() {

  for (let i = 0; i < options.runs; ++i) {
    shuffle(packages);
    console.info('run', (i + 1));
  
    for (const name of packages) {
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
