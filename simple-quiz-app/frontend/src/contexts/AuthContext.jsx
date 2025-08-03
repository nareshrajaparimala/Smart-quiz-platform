import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token validity
      authService.getProfile()
        .then(response => {
          setUser(response.data.data)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (userId, password) => {
    const response = await authService.login(userId, password)
    const { user: userData, token } = response.data.data
    
    localStorage.setItem('token', token)
    setUser(userData)
    return userData
  }

  const register = async (userData) => {
    const response = await authService.register(userData)
    const { user: userData2, token } = response.data.data
    
    localStorage.setItem('token', token)
    setUser(userData2)
    return userData2
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}