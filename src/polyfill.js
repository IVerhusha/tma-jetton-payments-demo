import { Buffer } from 'buffer/';

if (!('Buffer' in window || 'Buffer' in globalThis)) {
  globalThis.Buffer = Buffer;
}
