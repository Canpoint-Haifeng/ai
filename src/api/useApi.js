import { ref } from 'vue'
import apiClient from './apiClient'
import { API } from './config'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  // Generic GET request function
  const get = async (endpoint, params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // Handle both API object and direct URL object
      const url = typeof endpoint === 'string' 
        ? endpoint 
        : endpoint.urlPath || (API[endpoint]?.urlPath)
      
      if (!url) {
        throw new Error(`Invalid endpoint: ${JSON.stringify(endpoint)}`)
      }
      
      const response = await apiClient.get(url, { params })
      return response
    } catch (err) {
      error.value = err
      console.error('GET Error:', err)
      return { code: 500, msg: err.message, data: null }
    } finally {
      loading.value = false
    }
  }

  // Generic POST request function
  const post = async (endpoint, data = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // Handle both API object and direct URL object
      const url = typeof endpoint === 'string' 
        ? endpoint 
        : endpoint.urlPath || (API[endpoint]?.urlPath)
      
      if (!url) {
        throw new Error(`Invalid endpoint: ${JSON.stringify(endpoint)}`)
      }
      
      const response = await apiClient.post(url, data)
      return response
    } catch (err) {
      error.value = err
      console.error('POST Error:', err)
      return { code: 500, msg: err.message, data: null }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    get,
    post
  }
}
