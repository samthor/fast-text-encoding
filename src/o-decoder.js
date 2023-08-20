import { decodeBuffer } from './buffer.js';
import { decodeFallback } from './lowlevel.js';
import { failedToString, maybeThrowFailedToOption } from './shared.js';
import { hasBufferFrom } from './support.js';
import { decodeSyncXHR } from './xhr.js';

var trySyncXHR = !hasBufferFrom && (typeof Blob === 'function' && typeof URL === 'function' && typeof URL.createObjectURL === 'function');
var validUtfLabels = ['utf-8', 'utf8', 'unicode-1-1-utf-8'];

/** @type {(bytes: Uint8Array, encoding: string, fatal: boolean) => string} */
var decodeImpl = decodeFallback;
if (hasBufferFrom) {
  decodeImpl = decodeBuffer;
} else if (trySyncXHR) {
  decodeImpl = (string, encoding, fatal) => {
    try {
      return decodeSyncXHR(string);
    } catch (e) {
      return decodeFallback(string, encoding, fatal);
    }
  };
}


var ctorString = `construct 'TextDecoder'`;
var errorPrefix = `${failedToString} ${ctorString}: the `;


/**
 * @constructor
 * @param {string=} utfLabel
 * @param {{fatal: boolean}=} options
 */
export function FastTextDecoder(utfLabel, options) {
  utfLabel = utfLabel || 'utf-8';

  /** @type {boolean} */
  var ok;
  if (hasBufferFrom) {
    ok = Buffer.isEncoding(utfLabel);
  } else {
    ok = validUtfLabels.indexOf(utfLabel.toLowerCase()) !== -1;
  }
  if (!ok) {
    throw new RangeError(`${errorPrefix} encoding label provided ('${utfLabel}') is invalid.`);
  }

  this.encoding = utfLabel;
  this.fatal = options && options.fatal
    ? true
    : false;
  this.ignoreBOM = false;
}

/**
 * @param {(ArrayBuffer|ArrayBufferView)} buffer
 * @param {{stream: boolean, fatal: boolean}=} options
 * @return {string}
 */
FastTextDecoder.prototype.decode = function (buffer, options) {
  maybeThrowFailedToOption(options && options.stream, 'decode', 'stream');

  var bytes;

  if (buffer instanceof Uint8Array) {
    // Accept Uint8Array instances as-is. This is also a Node buffer.
    bytes = buffer;
  } else if (buffer['buffer'] instanceof ArrayBuffer) {
    // Look for ArrayBufferView, which isn't a real type, but basically
    // represents all the valid TypedArray types plus DataView. They all have
    // ".buffer" as an instance of ArrayBuffer.
    bytes = new Uint8Array(/** @type {ArrayBufferView} */(buffer).buffer);
  } else {
    // The only other valid argument here is that "buffer" is an ArrayBuffer.
    // We also try to convert anything else passed to a Uint8Array, as this
    // catches anything that's array-like. Native code would throw here.
    bytes = new Uint8Array(/** @type {any} */(buffer));
  }

  return decodeImpl(bytes, this.encoding, this.fatal);
};
