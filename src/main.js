import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/index.scss'
import '@/assets/iconfont/iconfont.css'
import VueClipboard from 'vue-clipboard2'
import App from './App.vue'
import router from './router'
import store from './store/index'
import { createI18n } from 'vue-i18n'
import language from '@/common/config/localLanguage'
import infiniteScroll from 'vue-infinite-scroll'
import throttleMixin from '@/common/mixins/throttle-mixin.js'
import Components from '@/components'
import Http from '@/api'
import Helper from '@/common/helper'
import Filter from '@/common/filter'
import Directive from '@/common/directive'
import Bus from '@/common/js/bus'
import { reQuids } from '@/common/js/util'
import CbLogin from '@/components/Login'
import CbRegister from '@/components/Register'
import CbTopBar from '@/components/Topbar'
import { getSimpleCheckedNodes } from '@/common/js/util'

// Create i18n instance
const i18n = createI18n({
  legacy: true, // Use legacy mode to be compatible with Vue 2
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  silentFallbackWarn: true,
  messages: language,
})

// Create app instance
const app = createApp(App)

// Global properties
app.config.globalProperties.Bus = Bus
app.config.globalProperties.reQuids = reQuids
app.config.globalProperties.$cpLogin = CbLogin.install
app.config.globalProperties.$cpRegister = CbRegister.install
app.config.globalProperties.$Topbar = CbTopBar.install
app.config.globalProperties.getSimpleCheckedNodes = getSimpleCheckedNodes

// Use plugins
app.use(ElementPlus)
app.use(VueClipboard)
app.use(Components)
app.use(Http)
app.use(Helper)
app.use(Filter)
app.use(Directive)
app.use(i18n)
app.use(router)
app.use(store)
app.use(infiniteScroll)

// Apply mixins
app.mixin(throttleMixin)

// Mount the app
app.mount('#app')

if (window.CKEDITOR && window.CKEDITOR.timestamp) {
  window.CKEDITOR.timestamp = process.env.VUE_APP_VERSION
}

try {
  console.log(
    '当前版本号v2：' +
      process.env.VUE_APP_VERSION / 1000,
  )
} catch (e) {
  console.log('当前版本号获取失败')
}
