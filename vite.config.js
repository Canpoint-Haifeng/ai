import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import obfuscator from 'vite-plugin-javascript-obfuscator'

// CDN resources
const cdn = {
  css: [
    '//static-file-01-cdn.canpoint.cn/common/cdn/element-plus/2.4.0/index.css',
  ],
  js: [
    '//static-file-01-cdn.canpoint.cn/common/cdn/vue/3.3.0/vue.global.prod.js',
    '//static-file-01-cdn.canpoint.cn/common/cdn/vue-router/4.0.0/vue-router.global.prod.js',
    '//static-file-01-cdn.canpoint.cn/common/cdn/vuex/4.0.0/vuex.global.prod.js',
    '//static-file-01-cdn.canpoint.cn/common/cdn/axios/1.6.0/axios.min.js',
    '//static-file-01-cdn.canpoint.cn/common/cdn/element-plus/2.4.0/index.full.js',
    '//static-file-01-cdn.canpoint.cn/common/cdn/echarts/5.4.0/echarts.min.js',
  ],
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd())
  const isProduction = mode === 'production' || mode === 'prod'
  
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      viteCompression({
        threshold: 10240, // 10kb
      }),
      createHtmlPlugin({
        inject: {
          data: {
            cdn: cdn
          }
        },
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          removeAttributeQuotes: false
        }
      }),
      // Only apply obfuscator in production
      isProduction && obfuscator({
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: true,
        stringArray: true,
        stringArrayEncoding: false,
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js', // Fix for vue-i18n warning
      },
    },
    server: {
      port: 8080,
      proxy: {
        '/paper-builder': {
          target: 'http://192.168.20.3',
          changeOrigin: true,
        },
        '/lesson-app': {
          target: 'http://192.168.20.3',
          changeOrigin: true,
        }
      }
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        }
      },
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
          manualChunks: {
            'element-plus': ['element-plus'],
            'echarts': ['echarts'],
            'vendors': [
              'vue',
              'vue-router',
              'vuex',
              'axios'
            ]
          }
        }
      },
      chunkSizeWarningLimit: 1500,
      sourcemap: !isProduction,
      // Equivalent to Vue CLI's assetsDir
      assetsDir: 'assets',
      // Equivalent to Vue CLI's productionSourceMap
      sourcemap: !isProduction
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/css/variables.scss";`
        }
      },
      // Equivalent to Vue CLI's extract
      extract: isProduction,
      // Equivalent to Vue CLI's sourceMap
      devSourcemap: !isProduction
    },
    define: {
      // Provide version timestamp for the app
      'process.env.VITE_APP_VERSION': JSON.stringify(new Date().getTime()),
      // Make env variables available
      'process.env': env
    },
    // Equivalent to Vue CLI's publicPath
    base: isProduction ? env.VITE_SRC || '/' : '/',
    // Equivalent to Vue CLI's outputDir
    outDir: 'dist'
  }
})
