import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/common/js/util'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add authorization token if available
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add loading indicator if needed
    // store.commit('SET_LOADING', true)
    
    return config
  },
  error => {
    // Handle request error
    ElMessage.error('Request configuration error')
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    // Remove loading indicator if needed
    // store.commit('SET_LOADING', false)
    
    // Handle successful response
    const res = response.data
    
    // Check if response has error code
    if (res.code && res.code !== 200) {
      ElMessage.error(res.message || 'Error')
      
      // Handle authentication errors
      if (res.code === 401 || res.code === 403) {
        // Redirect to login page or refresh token
        ElMessage.error('Authentication error, please login again')
        // router.push('/login')
      }
      
      return Promise.reject(new Error(res.message || 'Error'))
    }
    
    return res
  },
  error => {
    // Remove loading indicator if needed
    // store.commit('SET_LOADING', false)
    
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      
      // Handle different status codes
      switch (status) {
        case 401:
          ElMessage.error('Authentication error, please login again')
          // router.push('/login')
          break
        case 403:
          ElMessage.error('Access denied')
          break
        case 404:
          ElMessage.error('Resource not found')
          break
        case 500:
          ElMessage.error('Server error')
          break
        default:
          ElMessage.error(`Request failed with status ${status}`)
      }
    } else if (error.request) {
      // Request made but no response received
      ElMessage.error('Network error, please check your connection')
    } else {
      // Error in setting up the request
      ElMessage.error(error.message || 'Request error')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
