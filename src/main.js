import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/element-variables.scss'
import '@/assets/css/index.scss'
import '@/assets/css/temp/deep-fix.scss'
import '@/assets/css/temp/element-plus-fix.scss'
import '@/assets/iconfont/iconfont.css'
import Components from '@/components'
import Http from '@/api/http'  // Keep for backward compatibility
import Helper from '@/common/helper/helper'
import mitt from 'mitt'
import { reQuids, getSimpleCheckedNodes } from '@/common/js/util'
import CbLogin from '@/components/Login/CbLogin'
import CbRegister from '@/components/Register/CbRegister'
import CbTopBar from '@/components/Topbar/CbTopBar'

// Create event bus
const eventBus = mitt()

// Create app instance
const app = createApp(App)

// Register plugins
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(Components)
app.use(Http)  // Keep for backward compatibility
app.use(Helper)

// Global properties
app.config.globalProperties.eventBus = eventBus
app.config.globalProperties.reQuids = reQuids
app.config.globalProperties.getSimpleCheckedNodes = getSimpleCheckedNodes
app.config.globalProperties.$cpLogin = CbLogin.install
app.config.globalProperties.$cpRegister = CbRegister.install
app.config.globalProperties.$Topbar = CbTopBar.install

// Version logging
try {
  console.log('当前版本号v3：' + import.meta.env.VITE_APP_VERSION)
} catch (e) {
  console.log('当前版本号获取失败')
}

// Mount app
app.mount('#app')

console.log('Vue app initialized')
