import { createApp } from 'vue'
import Login from './Login'

let instance

Login.install = function (data) {
  if (instance) {
    let initDate = instance.initDate
    for (let sub in initDate) {
      if (sub != 'visible') {
        instance[sub] = data[sub] || initDate[sub]
      }
    }
  } else {
    // Create a div to mount our component
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    
    // Create the app instance
    const app = createApp(Login, { ...data })
    
    // Mount the app
    instance = app.mount(mountNode)
  }
  
  // Use nextTick from Vue 3
  Promise.resolve().then(() => {
    instance.visible = data.visible || false
  })
}

export default Login
