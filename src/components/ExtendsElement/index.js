import { createApp, nextTick } from 'vue'
import SimilarDialog from './similar-dialog.vue'

const extendsComponents = {
  SimilarDialog
}

function createExtends(item){
  let cpComponent = item
  let instance = null
  cpComponent.install = function (data) {
    if (instance) {
      let initDate = instance.initDate
      for (let sub in initDate) {
        instance[sub] = data[sub] || initDate[sub]
      }
    } else {
      // Create a div to mount our component
      const mountNode = document.createElement('div')
      
      // Create the app instance
      const app = createApp(cpComponent, { ...data })
      
      // Mount the app
      instance = app.mount(mountNode)
      document.body.appendChild(mountNode)
    }

    nextTick(() => {
      if(instance)
      {
        instance.show()
      }
    })
  }
}

for(let itemkey in extendsComponents)
{
  createExtends(extendsComponents[itemkey])
}

export default extendsComponents
