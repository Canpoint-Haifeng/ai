import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import './assets/css/index.scss'
import './assets/iconfont/iconfont.css'

// Create Vue app
console.log('Creating Vue app...')
const app = createApp(App)

// Use plugins
console.log('Using plugins...')
app.use(ElementPlus)
app.use(router)
app.use(store)

// Mount app
console.log('Mounting app...')
app.mount('#app')
console.log('App mounted successfully!')
