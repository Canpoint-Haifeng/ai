import { createApp, nextTick } from 'vue'
import Topbar from './Topbar.vue'

let instance = null

Topbar.install = function (data) {
  if (instance) {
    let initDate = instance.initDate
    for (let sub in initDate) {
      instance[sub] = data[sub] || initDate[sub]
    }
  } else {
    const app = createApp(Topbar, { data })
    const container = document.createElement('div')
    document.body.appendChild(container)
    instance = app.mount(container)
  }
  nextTick(() => {
    instance.loginStatus = false
  })
}

export default Topbar
