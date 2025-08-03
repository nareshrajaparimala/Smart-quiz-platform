import { Routes, Route, Navigate } from 'react-router-dom'
import { Container } from '@mui/material'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <DashboardPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/quiz/:topicId" 
          element={user ? <QuizPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/results/:quizAttemptId" 
          element={user ? <ResultsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Container>
  )
}

export default App