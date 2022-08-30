import { encodeBuffer } from './buffer.js';
import { encodeFallback } from './lowlevel.js';
import { maybeThrowFailedToOption } from './shared.js';
import { hasBufferFrom } from './support.js';

export var encodeImpl = hasBufferFrom ? encodeBuffer : encodeFallback;

/**
 * @constructor
 */
export function FastTextEncoder() {
  // This does not accept an encoding, and always uses UTF-8:
  //   https://www.w3.org/TR/encoding/#dom-textencoder
  this.encoding = 'utf-8';
}

/**
 * @param {string} string
 * @param {{stream: boolean}=} options
 * @return {Uint8Array}
 */
FastTextEncoder.prototype.encode = function (string, options) {
  maybeThrowFailedToOption(options && options.stream, 'encode', 'stream');
  return encodeImpl(string);
};
