import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import directives from './directives'
import filters from './filters'
import './assets/css/index.scss'
import './assets/css/temp/deep-fix.scss'
import './assets/css/temp/element-plus-fix.scss'

// Create the app instance
const app = createApp(App)

// Use plugins
app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(directives)
app.use(filters)

// Mount the app
app.mount('#app')
