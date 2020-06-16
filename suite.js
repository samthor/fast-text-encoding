function tests(isNative, TextEncoder, TextDecoder) {
  const dec = new TextDecoder();
  const enc = new TextEncoder('utf-8');

  suite(isNative ? 'native' : 'polyfill', () => {

    test('really large string', () => {
      const chunks = new Array(64);
      for (let i = 0; i < chunks.length; ++i) {
        const s = new Array(65535).fill('x'.charCodeAt(0));
        chunks[i] = s;
      }
      const s = chunks.join('');

      const buffer = enc.encode(s);
      const out = dec.decode(buffer);

      assert.equal(out, s);
    });

    suite('decoder', () => {

      test('basic', () => {
        const buffer = new Uint8Array([104, 101, 108, 108, 111]);
        assert.equal(dec.decode(buffer), 'hello', 'directly Uint8Array');
        assert.equal(dec.decode(buffer.buffer), 'hello', 'pass underlying ArrayBuffer');
      });

      test('non-8 backing', () => {
        // If passed a Uint32Array, TextDecoder will still decode the real
        // underlying bytes. Source data must be aligned.
        const padded = new Uint8Array([104, 101, 108, 108, 111, 33, 46, 46]);
        const u32 = new Uint32Array(padded.buffer);
        assert.equal(padded.length >> 2, u32.length, 'u32 must be 1/4 of real data');
        assert.equal(dec.decode(u32), 'hello!..', 'pass Uint32Array');
        assert.equal(dec.decode(u32.buffer), 'hello!..', 'pass Uint32Array\'s buffer');

        // Ensure that we don't parse larger typed arrays as uint8's. We expect
        // nulls here to pad out the remaining three bytes in every word.
        const u32raw = new Uint32Array([104, 105, 33, 46]);
        assert.equal(dec.decode(u32raw), 'h\0\0\0i\0\0\0!\0\0\0.\0\0\0', 'u32 with nulls');
      });

      test('arraylike', () => {
        const arr = [104, 101, 108, 108, 111];

        if (isNative) {
          // Native can't take Array.
          assert.throws(() => dec.decode(arr));
        } else {
          // Polyfill can accept Array or array-like.
          assert.equal(dec.decode(arr), 'hello', 'decode arraylike');
        }
      });

      test('constructor', () => {
        assert.throws(() => {
          new TextDecoder('invalid');
        }, RangeError);

        if (!isNative) {
          assert.throws(() => {
            new TextDecoder('utf-8', {fatal: true});
          }, Error, 'unsupported', 'fatal is unsupported');
        }
      });

      test('subarray', () => {
        const buffer = new Uint8Array([104, 101, 108, 108, 111]);
        const array = buffer.subarray(0, 4);
        assert.equal(dec.decode(array), 'hell');
      });

      test('null in middle', () => {
        const s = 'pad\x00pad';
        const buffer = new Uint8Array([112, 97, 100, 0, 112, 97, 100]);
        assert.deepEqual(dec.decode(buffer), s);
      });

      test('null at ends', () => {
        const s = '\x00\x00?\x00\x00';
        const buffer = new Uint8Array([0, 0, 63, 0, 0]);
        assert.deepEqual(dec.decode(buffer), s);
      });

    });

    suite('encoder', () => {

      test('basic', () => {
        const buffer = new Uint8Array([104, 101, 108, 108, 111]);
        assert.deepEqual(enc.encode('hello'), buffer);
      });

      test('constructor', () => {
        const enc2 = new TextEncoder('literally anything can go here');
        const enc3 = new TextEncoder(new Object());

        // Despite having no difference in functionality, these should not be the
        // same object.
        assert.notEqual(enc, enc2);
        assert.notEqual(enc, enc3);
      });

      test('ie11 .slice', () => {
        const originalSlice = Uint8Array.prototype.slice;
        try {
          Uint8Array.prototype.slice = null;
          assert.isNull(Uint8Array.prototype.slice);

          // Confirms that the method works even without .slice.
          const buffer = new Uint8Array([194, 161]);
          assert.deepEqual(enc.encode('¡'), buffer);

        } finally {
          Uint8Array.prototype.slice = originalSlice;
        }
      });

      test('null in middle', () => {
        const s = 'pad\x00pad';
        const buffer = new Uint8Array([112, 97, 100, 0, 112, 97, 100]);
        assert.deepEqual(enc.encode(s), buffer);
      });

      test('null at ends', () => {
        const s = '\x00\x00?\x00\x00';
        const buffer = new Uint8Array([0, 0, 63, 0, 0]);
        assert.deepEqual(enc.encode(s), buffer);
      });

    });

  });

}

if (typeof NativeTextEncoder !== 'undefined' && typeof NativeTextDecoder !== 'undefined') {
  tests(true, NativeTextEncoder, NativeTextDecoder);
}
tests(false, TextEncoder, TextDecoder);
