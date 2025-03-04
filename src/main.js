import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/variables.scss'
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
import Bus from '@/common/js/bus'
import App from './App.vue'
import router from './router'
import store from './store/index'
import { createI18n } from 'vue-i18n'
import language from '@/common/config/localLanguage'
// Import Vue 3 compatible version of infinite-scroll
import infiniteScroll from 'vue-infinite-scroll'
import throttleMixin from '@/common/mixins/throttle-mixin.js'

// import './mock/mock'
// import { Row, Col, Input, Badge, TabPane, Tabs, Button, ButtonGroup, TableColumn, Dialog, Form,
//   FormItem, Select, Upload, Table, Steps, Step, Option, OptionGroup, Pagination, Radio,
//   RadioGroup, RadioButton, Loading, MessageBox, Message, Checkbox, CheckboxButton, CheckboxGroup, Tooltip, Tree, Dropdown, DropdownMenu, DropdownItem, Menu, MenuItem, Submenu, Carousel, CarouselItem, Backtop } from 'element-ui'
// Vue.use(Row).use(Col).use(Input).use(Badge).use(TabPane)
//   .use(Tabs).use(Checkbox).use(CheckboxButton)
//   .use(CheckboxGroup).use(Button).use(ButtonGroup)
//   .use(Select).use(Upload).use(Table).use(Steps).use(Step).use(Option)
//   .use(OptionGroup).use(Pagination).use(TableColumn)
//   .use(Dialog).use(Form).use(FormItem).use(Radio).use(RadioButton)
//   .use(RadioGroup).use(Tooltip).use(Tree).use(Dropdown).use(DropdownMenu).use(DropdownItem).use(Menu).use(MenuItem).use(Submenu).use(Carousel).use(CarouselItem).use(Backtop)
// Vue.use(Loading.directive)
// Vue.prototype.$loading = Loading.service
// Vue.prototype.$msgbox = MessageBox
// Vue.prototype.$alert = MessageBox.alert
// Vue.prototype.$confirm = MessageBox.confirm
// Vue.prototype.$prompt = MessageBox.prompt
// // Vue.prototype.$notify = Notification
// Vue.prototype.$message = ElementUI.Message

// 通过选项创建 VueI18n 实例
const i18n = createI18n({
  locale: 'zh-CN', // 语言标识
  fallbackLocale: 'zh-CN', // 没有英文的时候默认中文语言
  silentFallbackWarn: true, // 抑制警告
  messages: language, // 设置地区信息1
})

const app = createApp(App)

// Global properties
app.config.globalProperties.Bus = Bus
app.config.globalProperties.reQuids = reQuids // 返回ids方法
app.config.globalProperties.$cpLogin = CbLogin.install
app.config.globalProperties.$cpRegister = CbRegister.install
app.config.globalProperties.$Topbar = CbTopBar.install
app.config.globalProperties.getSimpleCheckedNodes = getSimpleCheckedNodes

// Use plugins
app.use(ElementPlus)
app.use(VueClipboard) // 复制到剪切板
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
      Vue.prototype.$filter.datetime(process.env.VUE_APP_VERSION / 1000),
  )
} catch (e) {
  console.log('当前版本号获取失败')
}
