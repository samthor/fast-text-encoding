Benchmark code for Node, which encodes and decodes a string.
Usage:

```bash
./compare.js <filename>
# or
./compare.js <length>
```

If you don't provide a source file, or specify a length instead, this will generate actual random text in JavaScript.

For a better test, use suggested UTF-8 encoded source text from [Project Gutenberg](https://www.gutenberg.org/files/23841/23841-0.txt).
The linked file has a "bytes-to-length" ratio of 0.35.

This ratio compares the on-disk UTF-8 bytes (which optimize for ASCII and other low Unicode values) to the length of JavaScript's UCS-2 / UTF-16 internal representation.
All Unicode code points can be represented as either one or two "lengths" of a JavaScript string, but each code point can be between 1-4 bytes in UTF-8.
The valid ratios therefore range from ⅓ through 1.0 (e.g., ASCII).

# Options

By default, the benchmark tool disables and removes native-like implementations in Node.
It removes `Buffer` plus the native `TextEncoder` and `TextDecoder` from the global scope.

Use `--native` to retain `Buffer`, which will speed up `fast-text-encoding`.

# Results

As you'd expect, the native implementation is the speediest.
There's a bit of noise in the test; it's not perfect.

Tests on macOS, 3.6ghz i9, "fast-text-encoding" version 1.0.2.

## Low Ratio

Using the mentioned [test file](https://www.gutenberg.org/files/23841/23841-0.txt).

```
compare (file): length=971478, bytes=2740678 (ratio=0.35)
native speedups allowed? NO!

  10.2111ms .native 971477
  10.3203ms .native 971477
  10.9366ms .native 971477
  11.0249ms .native 971477
  11.6899ms .native 971477
  12.0494ms .native 971477
  36.8205ms fast-text-encoding 
  38.8506ms fast-text-encoding 
  42.8944ms fast-text-encoding 
  47.1252ms fast-text-encoding 
  53.2264ms fast-text-encoding 
  54.3824ms fast-text-encoding 
 134.3251ms fastestsmallesttextencoderdecoder 
 136.6160ms fastestsmallesttextencoderdecoder 
 136.6426ms fastestsmallesttextencoderdecoder 
 137.1191ms fastestsmallesttextencoderdecoder 
 138.0675ms fastestsmallesttextencoderdecoder 
 139.7024ms fastestsmallesttextencoderdecoder 
 470.6317ms text-encoding 971477
 473.9435ms text-encoding-polyfill 971477
 475.3746ms text-encoding-polyfill 971477
 475.5197ms text-encoding 971477
 479.5304ms text-encoding-polyfill 971477
 481.5665ms text-encoding-polyfill 971477
 482.3216ms text-encoding-polyfill 971477
 485.8300ms text-encoding 971477
 488.6046ms text-encoding-polyfill 971477
 490.6234ms text-encoding 971477
 493.1231ms text-encoding 971477
 493.4262ms text-encoding 971477
```

## High Ratio

UTF-8 text which mostly looks like ASCII, [from here](https://www.gutenberg.org/ebooks/44217.txt.utf-8).

```
compare (file): length=99190, bytes=101960 (ratio=0.97)
native speedups allowed? NO!

   0.3634ms .native 99189
   0.6308ms .native 99189
   0.6374ms .native 99189
   0.6768ms .native 99189
   0.8520ms .native 99189
   0.8711ms .native 99189
   2.2705ms fastestsmallesttextencoderdecoder 
   2.2917ms fastestsmallesttextencoderdecoder 
   2.3838ms fastestsmallesttextencoderdecoder 
   2.9010ms fast-text-encoding 
   3.3695ms fast-text-encoding 
   3.4776ms fast-text-encoding 
   7.5336ms fast-text-encoding 
   8.3014ms fastestsmallesttextencoderdecoder 
   9.4051ms fastestsmallesttextencoderdecoder 
  10.0201ms fastestsmallesttextencoderdecoder 
  10.7546ms fast-text-encoding 
  12.2336ms fast-text-encoding 
  16.4143ms text-encoding-polyfill 99189
  16.6515ms text-encoding-polyfill 99189
  17.1320ms text-encoding 99189
  17.8296ms text-encoding 99189
  23.5324ms text-encoding-polyfill 99189
  23.5962ms text-encoding 99189
  25.2543ms text-encoding 99189
  25.5921ms text-encoding 99189
  26.2855ms text-encoding-polyfill 99189
  27.0913ms text-encoding-polyfill 99189
  30.2643ms text-encoding 99189
  32.3319ms text-encoding-polyfill 99189
```
