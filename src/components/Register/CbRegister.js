import { createVNode, render } from 'vue'
import Register from './Register.vue.new'

export default {
  install(app) {
    // Create a global method for showing register dialog
    app.config.globalProperties.$cpRegister = (options) => {
      // Create a div container for the register component
      const container = document.createElement('div')
      
      // Create the register component vnode
      const vnode = createVNode(Register, {
        ...options,
        // Add event handlers
        onGoLogin: () => {
          if (options && options.onGoLogin) {
            options.onGoLogin()
          }
          // Clean up when done
          render(null, container)
        },
        onGoAgreement: () => {
          if (options && options.onGoAgreement) {
            options.onGoAgreement()
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
