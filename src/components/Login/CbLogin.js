import { createVNode, render } from 'vue'
import Login from './Login.vue.new'

export default {
  install(app) {
    // Create a global method for showing login dialog
    app.config.globalProperties.$cpLogin = (options) => {
      // Create a div container for the login component
      const container = document.createElement('div')
      
      // Create the login component vnode
      const vnode = createVNode(Login, {
        ...options,
        // Add event handlers
        onGoRegister: () => {
          if (options && options.onGoRegister) {
            options.onGoRegister()
          }
          // Clean up when done
          render(null, container)
        }
      })
      
      // Render the component to the container
      render(vnode, container)
      
      // Return the component instance for external control
      return vnode.component
    }
  }
}
