import { createApp } from 'vue'
import Topbar from './Topbar'

let instance

Topbar.install = function (data) {
  if (instance) {
    let initDate = instance.initDate
    for (let sub in initDate) {
      instance[sub] = data[sub] || initDate[sub]
    }
  } else {
    // Create a div to mount our component
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    
    // Create the app instance
    const app = createApp(Topbar, { ...data })
    
    // Mount the app
    instance = app.mount(mountNode)
  }
  
  // Use nextTick from Vue 3
  Promise.resolve().then(() => {
    instance.loginStatus = false
  })
}

export default Topbar
