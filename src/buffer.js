
/**
 * @param {Uint8Array} bytes
 * @param {string} encoding
 * @return {string}
 */
export function decodeBuffer(bytes, encoding) {
  /** @type {Buffer} */
  let b;
  if (bytes instanceof Buffer) {
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
export const encodeBuffer = (string) => Buffer.from(string);
