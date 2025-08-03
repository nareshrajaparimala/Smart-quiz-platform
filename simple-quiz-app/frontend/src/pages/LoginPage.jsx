import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Tab, 
  Tabs,
  Alert,
  Link
} from '@mui/material'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const [tab, setTab] = useState(0)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { login, register } = useAuth()
  
  const loginForm = useForm()
  const registerForm = useForm()
  const forgotForm = useForm()

  const handleLogin = async (data) => {
    try {
      await login(data.userId, data.password)
      toast.success('Login successful!')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Login failed')
    }
  }

  const handleRegister = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    try {
      await register({
        userId: data.userId,
        password: data.password,
        email: data.email
      })
      toast.success('Registration successful!')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Registration failed')
    }
  }

  const handleForgotPassword = async (data) => {
    try {
      // Implementation for forgot password
      toast.success('Password reset email sent!')
      setShowForgotPassword(false)
    } catch (error) {
      toast.error('Failed to send reset email')
    }
  }

  if (showForgotPassword) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Card sx={{ maxWidth: 400, width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              Reset Password
            </Typography>
            <Box component="form" onSubmit={forgotForm.handleSubmit(handleForgotPassword)}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                {...forgotForm.register('email', { required: 'Email is required' })}
                error={!!forgotForm.formState.errors.email}
                helperText={forgotForm.formState.errors.email?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={forgotForm.formState.isSubmitting}
              >
                Send Reset Email
              </Button>
              <Button
                fullWidth
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Quiz App
          </Typography>
          
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {tab === 0 && (
            <Box component="form" onSubmit={loginForm.handleSubmit(handleLogin)} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="User ID"
                margin="normal"
                {...loginForm.register('userId', { 
                  required: 'User ID is required',
                  pattern: {
                    value: /^[a-zA-Z0-9]{3,20}$/,
                    message: 'User ID must be 3-20 alphanumeric characters'
                  }
                })}
                error={!!loginForm.formState.errors.userId}
                helperText={loginForm.formState.errors.userId?.message}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                {...loginForm.register('password', { required: 'Password is required' })}
                error={!!loginForm.formState.errors.password}
                helperText={loginForm.formState.errors.password?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loginForm.formState.isSubmitting}
              >
                Login
              </Button>
              <Box textAlign="center">
                <Link 
                  component="button" 
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </Link>
              </Box>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={registerForm.handleSubmit(handleRegister)} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="User ID"
                margin="normal"
                {...registerForm.register('userId', { 
                  required: 'User ID is required',
                  pattern: {
                    value: /^[a-zA-Z0-9]{3,20}$/,
                    message: 'User ID must be 3-20 alphanumeric characters'
                  }
                })}
                error={!!registerForm.formState.errors.userId}
                helperText={registerForm.formState.errors.userId?.message}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                {...registerForm.register('email', { required: 'Email is required' })}
                error={!!registerForm.formState.errors.email}
                helperText={registerForm.formState.errors.email?.message}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                {...registerForm.register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                error={!!registerForm.formState.errors.password}
                helperText={registerForm.formState.errors.password?.message}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                margin="normal"
                {...registerForm.register('confirmPassword', { required: 'Please confirm password' })}
                error={!!registerForm.formState.errors.confirmPassword}
                helperText={registerForm.formState.errors.confirmPassword?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={registerForm.formState.isSubmitting}
              >
                Register
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage