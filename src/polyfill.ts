import { Buffer } from 'buffer';

if (!('Buffer' in window || 'Buffer' in globalThis)) {
  (window as any)['Buffer'] = Buffer;
}
