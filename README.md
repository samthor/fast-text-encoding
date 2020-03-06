<img src="https://api.travis-ci.org/samthor/fast-text-encoding.svg?branch=master" />

This is a fast polyfill for [`TextEncoder`][1] and [`TextDecoder`][2], which let you encode and decode JavaScript strings into UTF-8 bytes.

It is fast partially as it does not support any encodings aside UTF-8 (and note that natively, only `TextDecoder` supports alternative encodings anyway).

[1]: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
[2]: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder

# Usage

Install as "fast-text-encoding" via your favourite package manager.

## Browser

Include the minified code inside a `script` tag or as an ES6 Module for its side effects.
It will create `TextEncoder` and `TextDecoder` if the symbols are missing on `window` or `global.`

```html
<script src="node_modules/fast-text-encoding/text.min.js"></script>
<script type="module">
  import './node_modules/fast-text-encoding/text.min.js';
  import 'fast-text-encoding';  // or perhaps this
  // confidently do something with TextEncoder \o/
</script>
```

**Note**: You want `text.min.js`, as it's compiled to ES5 for older environments.

## Node

```js
// don't need to save anywhere, just require before use
require('fast-text-encoding');

const buffer = new TextEncoder().encode('Turn me into UTF-8!');
// buffer is now a Uint8Array of [84, 117, 114, 110, ...]
```

However, note that `Buffer.from('Turn me into UTF-8!')` is Node's native version of the text encoding functionality.
You can probably massage [`Buffer`](https://nodejs.org/api/buffer.html) into acting like `TextEncoder` and `TextDecoder`.

# Supports

Built for IE11, Edge and Node environments.
Not required for Chrome, Firefox etc, which have native implementations.

# Release

Compile code with [Closure Compiler](https://closure-compiler.appspot.com/home).

```
// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name text.min.js
// ==/ClosureCompiler==

// code here
```
