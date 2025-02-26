import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createI18n } from 'vue-i18n'
import '@/assets/css/element-variables.scss'
import 'element-plus/dist/index.css'
import '@/assets/css/index.scss'
import '@/assets/iconfont/iconfont.css'
import VueClipboard from 'vue-clipboard2'
import Components from '@/components'
import Http from '@/api/http'
import Helper from '@/common/helper/helper'
import { reQuids, getSimpleCheckedNodes } from '@/common/js/util'
import Filter from '@/common/js/filter'
import Directive from '@/common/js/directive'
import CbLogin from '@/components/Login/CbLogin'
import CbRegister from '@/components/Register/CbRegister'
import CbTopBar from '@/components/Topbar/CbTopBar'
import emitter from '@/utils/emitter'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import language from '@/common/config/localLanguage'
import infiniteScroll from 'vue-infinite-scroll'
import { useThrottle } from '@vueuse/core'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  silentFallbackWarn: true,
  messages: language,
})

const app = createApp(App)

// Global properties
app.config.globalProperties.emitter = emitter
app.config.globalProperties.reQuids = reQuids
app.config.globalProperties.$cpLogin = CbLogin.install
app.config.globalProperties.$cpRegister = CbRegister.install
app.config.globalProperties.$Topbar = CbTopBar.install
app.config.globalProperties.getSimpleCheckedNodes = getSimpleCheckedNodes

// Plugins
app.use(ElementPlus)
app.use(VueClipboard)
app.use(Components)
app.use(Http)
app.use(Helper)
app.use(Filter)
app.use(Directive)
app.use(i18n)
app.use(infiniteScroll)
app.use(router)
app.use(store)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err, info)
}

// Version logging
if (window.CKEDITOR && window.CKEDITOR.timestamp) {
  window.CKEDITOR.timestamp = import.meta.env.VITE_APP_VERSION
}

try {
  console.log(
    '当前版本号v2：' +
      app.config.globalProperties.$filter.datetime(import.meta.env.VITE_APP_VERSION / 1000),
  )
} catch (e) {
  console.log('当前版本号获取失败')
}

app.mount('#app')

export default app
