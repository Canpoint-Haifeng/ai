import { createApp } from 'vue'
import WarningDialog from './WarningDialog.vue'

let instance

WarningDialog.install = function (data) {
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
    const app = createApp(WarningDialog, { ...data })
    
    // Mount the app
    instance = app.mount(mountNode)
  }
  
  // Use nextTick from Vue 3
  Promise.resolve().then(() => {
    instance.visible = true
  })
}

export default WarningDialog
