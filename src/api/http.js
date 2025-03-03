import { useApi } from './useApi'
import { API } from './config'

export default {
  install(app) {
    const { get, post } = useApi()
    
    // Maintain backward compatibility with existing code
    app.config.globalProperties.apiGet = async (url, params = {}, options = {}) => {
      return get(url, params, options)
    }
    
    app.config.globalProperties.apiPost = async (url, data = {}, options = {}) => {
      return post(url, data, options)
    }
    
    // Add new methods for composition API
    app.provide('api', {
      get,
      post,
      API
    })
  }
}
