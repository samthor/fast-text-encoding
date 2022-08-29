
import { FastTextEncoder } from './o-encoder.js';
import { FastTextDecoder } from './o-decoder.js';

// /** @type {object} */
// const scope = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);

scope['TextEncoder'] = scope['TextEncoder'] || FastTextEncoder;
scope['TextDecoder'] = scope['TextDecoder'] || FastTextDecoder;

// export {};
