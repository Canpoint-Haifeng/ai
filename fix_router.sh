#!/bin/bash

echo "Fixing router configuration..."

# Create a backup of the original files
cp src/router/index.js src/router/index.js.backup
cp src/main.js src/main.js.backup

# Update the router configuration
cat > src/router/index.js << 'EOT'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue')
      }
    ]
  },
  {
    path: '/paperIndex',
    name: 'PaperIndex',
    component: () => import('../views/paper-index/paper-index.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/lesson/'),
  routes
})

export default router
EOT

# Create a Layout component if it doesn't exist
mkdir -p src/views
cat > src/views/Layout.vue << 'EOT'
<template>
  <div class="layout">
    <div class="layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  
  .layout-content {
    width: 100%;
    min-height: 100vh;
  }
}
</style>
EOT

# Update the main.js file to ensure it's using the correct router
cat > src/main.js << 'EOT'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/index.scss'
import './assets/iconfont/iconfont.css'

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(ElementPlus)
app.use(router)
app.use(store)

// Mount app
app.mount('#app')
EOT

# Update the App.vue file to ensure it's using the correct router-view
cat > src/App.vue << 'EOT'
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
EOT

echo "Successfully fixed router configuration."
