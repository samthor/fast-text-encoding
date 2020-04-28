Benchmark code for Node.
Usage:

```bash
./compare.js <filename>
# or
./compare.js <length>
```

If you don't provide a source file, or specify a length instead, this will generate actual random text in JavaScript.

For a better test, use suggested UTF-8 encoded source text from [Project Gutenberg](https://www.gutenberg.org/files/23841/23841-0.txt).
This has a ratio of "bytes-to-length" of 0.35.

This is an odd number, but we're comparing the on-disk UTF-8 bytes (which optimize for ASCII and other low Unicode values) to the length of JavaScript's UCS-2 / UTF-16 internal representation.
All Unicode code points can be represented as either one or two "lengths" of a JavaScript string, but each code point can be between 1-4 bytes in UTF-8.
The possible ratios therefore range from 0.25 (e.g., all emoji) through 1.0 (e.g., ASCII).

# Options

By default, the benchmark tool disables and removes native-like implementations in Node.
It removes `Buffer` plus the native `TextEncoder` and `TextDecoder` from the global scope.

Use `--native` to enable support for them.
This will speed up `fast-text-encoding`, as it uses `Buffer` when available.

# Results

For the suggested text on my test rig (macOS 3.6GHz i9), output looks like (snipped):

```
compare (file): length=971478, bytes=2740678 (ratio=0.35)

  10.2209ms .native 971477
  10.8853ms .native 971477
  10.9297ms .native 971477
  11.1351ms .native 971477
  11.3154ms .native 971477
  11.3741ms .native 971477
  11.4921ms .native 971477
  12.1611ms .native 971477
  25.9949ms fast-text-encoding 
  26.3912ms fast-text-encoding 
  26.7037ms fast-text-encoding 
  32.1910ms fast-text-encoding 
  36.6454ms fast-text-encoding 
  44.6358ms fast-text-encoding 
  47.1846ms fast-text-encoding 
  51.7178ms fast-text-encoding 
 125.2835ms fastestsmallesttextencoderdecoder 
 126.0772ms fastestsmallesttextencoderdecoder 
 129.5148ms fastestsmallesttextencoderdecoder 
 129.9449ms fastestsmallesttextencoderdecoder 
 135.1421ms fastestsmallesttextencoderdecoder 
 137.6716ms fastestsmallesttextencoderdecoder 
 152.4639ms fastestsmallesttextencoderdecoder 
 155.1741ms fastestsmallesttextencoderdecoder 
 467.4895ms text-encoding-polyfill 971477
 469.5857ms text-encoding-polyfill 971477
 470.4829ms text-encoding-polyfill 971477
 472.6093ms text-encoding-polyfill 971477
 472.6358ms text-encoding-polyfill 971477
 474.5790ms text-encoding-polyfill 971477
 476.7881ms text-encoding-polyfill 971477
 477.0778ms text-encoding 971477
 478.0450ms text-encoding-polyfill 971477
 478.2031ms text-encoding 971477
 480.0009ms text-encoding 971477
 480.2125ms text-encoding 971477
 485.2014ms text-encoding 971477
 485.9727ms text-encoding 971477
 486.2783ms text-encoding 971477
 490.5393ms text-encoding 971477
```

As you'd expect, the native implementation is the speediest.
There's a bit of noise in the test; it's not perfect.
