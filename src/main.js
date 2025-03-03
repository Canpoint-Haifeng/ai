import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/index.scss'
import './assets/css/temp/deep-fix.scss'
import './assets/css/temp/element-plus-fix.scss'
import Components from '@/components'
import Http from '@/api/http'
import mitt from 'mitt'

// Create event bus for component communication
const emitter = mitt()

// Create Vue app instance
const app = createApp(App)

// Register global properties
app.config.globalProperties.$ELEMENT = {
  size: 'medium',
  zIndex: 3000
}
app.config.globalProperties.emitter = emitter

// Use plugins
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(Components)
app.use(Http)

// Mount app to DOM
app.mount('#app')

console.log('Vue 3 app initialized with Element Plus')
