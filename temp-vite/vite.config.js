import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: true,
    proxy: {
      '/paper-builder': {
        target: 'http://192.168.20.3',
        changeOrigin: true
      },
      '/lesson-app': {
        target: 'http://192.168.20.3',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'vuex',
        'axios',
        'element-plus',
        'echarts'
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          vuex: 'Vuex',
          axios: 'axios',
          'element-plus': 'ElementPlus',
          echarts: 'echarts'
        }
      }
    }
  }
})
