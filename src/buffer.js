
/**
 * @param {Uint8Array} bytes
 * @param {string} encoding
 * @return {string}
 */
export function decodeBuffer(bytes, encoding) {
  /** @type {Buffer} */
  var b;
  if (bytes instanceof Buffer) {
    // @ts-ignore
    b = bytes;
  } else {
    b = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }
  return b.toString(/** @type {BufferEncoding} */(encoding));
}


/**
 * @param {string} string
 * @return {Uint8Array}
 */
export var encodeBuffer = (string) => Buffer.from(string);
