// Filter functions
export default {
  install(app) {
    // Add filter methods to the app
    console.log('Filter plugin installed')
    
    // Add a datetime filter
    app.config.globalProperties.$filter = {
      datetime: (timestamp) => {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        return date.toLocaleString()
      }
    }
  }
}
