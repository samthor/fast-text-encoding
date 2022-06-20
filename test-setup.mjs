
const NativeTextEncoder = global.TextEncoder;
const NativeTextDecoder = global.TextDecoder;

global.TextDecoder = null;
global.TextEncoder = null;

export { NativeTextEncoder, NativeTextDecoder };
