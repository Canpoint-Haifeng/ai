import axios from 'axios'

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add authorization token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data)
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Redirect to login or refresh token
        console.error('Authentication error')
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request)
    } else {
      // Error in setting up the request
      console.error('Request Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
