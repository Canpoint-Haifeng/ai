#!/bin/bash

# Update the variables.scss file to ensure it has all necessary variables
cat > src/assets/css/variables.scss << 'EOFVARS'
// Colors
$color-white: #fff;
$color-black: #000;
$color-background: #f5f5f5;
$color-background-d: #eee;
$color-background-l: #f9f9f9;
$color-text: #333;
$color-text-d: #666;
$color-text-l: #999;
$color-text-ll: #ccc;
$color-theme: #4b8ff5;
$color-theme-d: #3a7fe0;
$color-theme-l: #7eadf7;
$color-theme-ll: #d0e2fd;
$color-theme-l-hover: #6a9ef6;
$color-border: #e5e5e5;
$color-border-d: #ddd;
$color-border-l: #eee;
$color-success: #67c23a;
$color-warning: #e6a23c;
$color-danger: #f56c6c;
$color-info: #909399;
$color-menu-l-hover: #ecf5ff;
$color-menu-l: #f5f7fa;
$color-table-bg: #f8f8f9;

// Font sizes
$font-size-small-s: 10px;
$font-size-small: 12px;
$font-size-medium: 14px;
$font-size-medium-x: 16px;
$font-size-large: 18px;
$font-size-large-x: 22px;

// Spacing
$spacing-small: 5px;
$spacing-medium: 10px;
$spacing-large: 15px;
$spacing-xlarge: 20px;
$spacing-xxlarge: 30px;

// Border radius
$border-radius-small: 2px;
$border-radius-medium: 4px;
$border-radius-large: 8px;

// Z-index
$z-index-normal: 1;
$z-index-dropdown: 10;
$z-index-fixed: 100;
$z-index-modal: 1000;
$z-index-popup: 2000;
EOFVARS

# Update the index.scss file to ensure it imports variables.scss first
cat > src/assets/css/index.scss << 'EOFINDEX'
/* Import variables first */
@import './variables.scss';
@import './mixins.scss';

/* Import CSS files */
@import './normalize.css';
@import './base.scss';
@import './element-rewrite.scss';
@import './cp-tiku-ui.scss';
EOFINDEX

# Update the element-rewrite.scss file to ensure it imports variables.scss
if ! grep -q "@import \"./variables.scss\";" src/assets/css/element-rewrite.scss; then
  sed -i '1i @import "./variables.scss";' src/assets/css/element-rewrite.scss
  echo "Added variables.scss import to element-rewrite.scss"
fi

# Update the cp-tiku-ui.scss file to ensure it imports variables.scss
if ! grep -q "@import \"./variables.scss\";" src/assets/css/cp-tiku-ui.scss; then
  sed -i '1i @import "./variables.scss";' src/assets/css/cp-tiku-ui.scss
  echo "Added variables.scss import to cp-tiku-ui.scss"
fi

# Update the vite.config.js file to ensure it properly processes SCSS files
cat > vite.config.js << 'EOFVITE'
// ESM syntax for Vite configuration to avoid CJS deprecation warning
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import legacy from '@vitejs/plugin-legacy'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
          whitespace: 'preserve',
          comments: true,
          delimiters: ['{{', '}}']
        }
      },
      // Configure Vue 3 compatibility mode
      // https://v3-migration.vuejs.org/migration-build.html
      compilerOptions: {
        compatConfig: {
          MODE: 2,
          COMPONENT_V_MODEL: false,
          COMPILER_V_BIND_SYNC: false,
          COMPILER_V_BIND_OBJECT_ORDER: false,
          COMPILER_V_ON_NATIVE: false,
          COMPILER_NATIVE_TEMPLATE: false,
          INSTANCE_ATTRS_CLASS_STYLE: false,
          INSTANCE_LISTENERS: false,
          INSTANCE_SCOPED_SLOTS: false,
          RENDER_FUNCTION: false,
          GLOBAL_MOUNT: false
        }
      }
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: true
    })
  ],
  base: '/lesson/',
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
      'vue': '@vue/compat'
    }
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: '@import "@/assets/css/variables.scss";'
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1500
  }
})
EOFVITE

echo "Successfully updated SASS variable files and Vite configuration."
