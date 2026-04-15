import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

import obfuscator from 'vite-plugin-javascript-obfuscator';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
const isBuild = process.env.NODE_ENV === 'production' || true;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Giúp giả lập module 'stream' mà JMuxer đang đòi
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
        vite: {
          plugins: [
            // 🚀 CHỈ CHẠY OBFUSCATOR KHI BUILD THẬT
            ...(isBuild ? [obfuscator({
              options: {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.4,
                stringArray: true,
                stringArrayEncoding: ['base64'],
                stringArrayThreshold: 0.75,
                unicodeEscapeSequence: true,
                identifierNamesGenerator: 'mangled',
                removeComments: false,
              },
            })] : [])
          ],
          build: {
            minify: false,
            rollupOptions: {
              // Vẫn giữ external cho các thư viện native để tránh lỗi build
              external: [
                'adbkit',
                'bufferutil',
                'utf-8-validate',
                'sharp',
                'electron'
              ],
            },
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: process.env.NODE_ENV === 'test'
        ? undefined
        : {},
    }),
  ],
})