import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import manifest from './src/manifest'
import packageConfig from './package.json'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 输出目录
  const outDir =
    mode === 'production'
      ? `${packageConfig.name}-${packageConfig.version}`
      : `${packageConfig.name}-${packageConfig.version}-${mode}`

  return {
    mode,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      emptyOutDir: true,
      outDir,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/quick-nav-chunk-[hash].js',
        },
      },
    },

    plugins: [crx({ manifest }), react()],
  }
})
