import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        // 將所有帶 swiper- 的標籤名都視為自定義元素
        isCustomElement: tag => tag.startsWith('swiper-')
      }
    }
  }
  )],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },

  },

})
