import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// SWC est nécessaire pour émettre les métadonnées de décorateurs dont NestJS a besoin.
export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [swc.vite({ module: { type: 'es6' } })],
});
