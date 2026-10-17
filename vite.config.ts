import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Library build: JS goes to dist/index.js, all component styles to dist/style.css.
// Types come from vue-tsc (tsconfig.build.json), not from Vite.
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    // Consumers minify in their own build; readable output is easier to debug.
    minify: false,
    rollupOptions: {
      external: ['vue', /^@lucide\/vue/],
    },
  },
})
