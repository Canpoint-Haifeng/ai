import { createApp, nextTick } from 'vue'
import Login from './Login.vue'

let instance = null

Login.install = function (data) {
  if (instance) {
    let initDate = instance.initDate
    for (let sub in initDate) {
      if (sub != 'visible') {
        instance[sub] = data[sub] || initDate[sub]
      }
    }
  } else {
    const app = createApp(Login, { data })
    const container = document.createElement('div')
    document.body.appendChild(container)
    instance = app.mount(container)
  }
  nextTick(() => {
    instance.visible = data.visible || false
  })
}

export default Login
