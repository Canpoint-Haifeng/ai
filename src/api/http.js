import axios from 'axios'

// Create axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000
})

// Request interceptor
service.interceptors.request.use(
  config => {
    // Add token to headers if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // Check if response is successful
    if (res.code !== 200) {
      console.error('API error:', res.message || 'Error')
      
      // Handle unauthorized error
      if (res.code === 401) {
        // Redirect to login page
        window.location.href = '/login'
      }
      
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

export default service
