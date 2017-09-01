This is a fast polyfill for [`TextEncoder`][1] and [`TextDecoder`][2], which let you encode and decode JavaScript strings into UTF-8 bytes.

It is fast partially as it does not support any encodings aside UTF-8 (and note that natively, only `TextDecoder` supports alternative encodings anyway).

[1]: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
[2]: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder

# Usage

Include the minified inside a `script` tag or as an ES6 Module for its side-effects.
It will create `TextEncoder` and `TextDecoder` if the symbols are missing on `window`.

```html
<script src="node_modules/fast-text-encoding/text.min.js"></script>
<script type="module">
  import './node_modules/fast-text-encoding/text.min.js';
  // do something with TextEncoder
</script>
```

**Note**: Always include `text.min.js`, as it's compiled to ES5 for older environments.

## Node

Install via NPM or Yarn:

```bash
yarn add fast-text-encoding
```

And then import purely for side effects:

```js
require('fast-text-encoding');
```

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