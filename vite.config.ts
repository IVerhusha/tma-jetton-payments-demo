import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'tma-jetton-payments-demo',
  plugins: [react(), tsconfigPaths()],
  publicDir: './public',
});

