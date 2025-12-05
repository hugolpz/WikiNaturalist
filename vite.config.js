import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const plugins = [vue()]

  // Only add devtools in development
  if (command !== 'build') {
    plugins.push(vueDevTools())
  }

  // Determine base URL based on build target
  // - Toolforge: root path (/)
  // - GitHub Pages: subpath (/WikiNaturalist/)
  // - Development: root path (/)
  const base = mode === 'toolforge' ? '/' : command === 'build' ? '/WikiNaturalist/' : '/'

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  }
})
