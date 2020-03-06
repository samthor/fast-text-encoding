/**
 * @fileoverview Test runner inside a Node environment.
 */

const mocha = require('mocha');
const chai = require('chai');

global.suite = mocha.suite;
global.test = mocha.test;
global.assert = chai.assert;

global.NativeTextDecoder = global.TextDecoder;
global.NativeTextEncoder = global.TextEncoder;
global.TextDecoder = null;
global.TextEncoder = null;

require('./text.js');  // include polyfill
require('./suite.js');
