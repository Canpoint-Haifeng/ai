import { createApp, nextTick } from 'vue'
import Register from './Register.vue'

let instance = null

Register.install = function (data) {
  if (instance) {
    let initDate = instance.initDate
    for (let sub in initDate) {
      if (sub != 'visible') {
        instance[sub] = data[sub] || initDate[sub]
      }
    }
  } else {
    const app = createApp(Register, { data })
    const container = document.createElement('div')
    document.body.appendChild(container)
    instance = app.mount(container)
  }

  nextTick(() => {
    instance.visible = data.visible || false
  })
}

export default Register
