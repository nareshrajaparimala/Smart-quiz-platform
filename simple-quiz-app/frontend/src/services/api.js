import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userId, password) => api.post('/auth/login', { userId, password }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (email, verificationCode, newPassword) => 
    api.post('/auth/reset-password', { email, verificationCode, newPassword }),
  getProfile: () => api.get('/users/profile'),
  validateUserId: (userId) => api.post('/users/validate-id', { userId }),
}

// Quiz services
export const quizService = {
  getTopics: () => api.get('/quiz/topics'),
  startQuiz: (topicId) => api.post('/quiz/start', { topicId }),
  submitAnswer: (data) => api.post('/quiz/submit-answer', data),
  completeQuiz: (quizAttemptId) => api.post('/quiz/complete', { quizAttemptId }),
}

// Analytics services
export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getQuestionPerformance: (params) => api.get('/analytics/question-performance', { params }),
  exportReport: (params) => api.get('/analytics/export', { params }),
}

export default api