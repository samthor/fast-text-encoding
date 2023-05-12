import { FastTextEncoder } from './o-encoder.js';
import { FastTextDecoder } from './o-decoder.js';

function polyfill(scope) {
  scope['TextEncoder'] = scope['TextEncoder'] || FastTextEncoder;
  scope['TextDecoder'] = scope['TextDecoder'] || FastTextDecoder;
}

polyfill(
  typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : this,
);
