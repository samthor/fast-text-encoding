
/**
 * @param {Uint8Array} bytes
 * @param {string} encoding
 * @return {string}
 */
export function decodeBuffer(bytes, encoding, fatal) {
  /** @type {Buffer} */
  var b;
  if (bytes instanceof Buffer) {
    // @ts-ignore
    b = bytes;
  } else {
    try {
      b = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    } catch(err) {
      if (!fatal) {
        return '';
      } else {
        throw err;
      }
    }
   }
  return b.toString(/** @type {BufferEncoding} */(encoding));
}


/**
 * @param {string} string
 * @return {Uint8Array}
 */
export var encodeBuffer = (string) => Buffer.from(string);
