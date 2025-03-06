import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router.js'
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
