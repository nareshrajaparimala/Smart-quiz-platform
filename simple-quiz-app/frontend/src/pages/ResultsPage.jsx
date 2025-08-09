import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material'
import { 
  Home, 
  CheckCircle, 
  Cancel, 
  Timer, 
  TrendingUp,
  Download
} from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import { quizService } from '../services/api'

const ResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { quizAttemptId } = useParams()
  const queryClient = useQueryClient()
  
  const [results, setResults] = useState(location.state?.results || null)

  // Fetch results if not passed via state
  const { data: fetchedResults, isLoading } = useQuery(
    ['quiz-results', quizAttemptId],
    () => quizService.completeQuiz(quizAttemptId),
    {
      enabled: !results,
      select: (response) => response.data.data,
      onSuccess: (data) => setResults(data)
    }
  )

  const handleReturnHome = () => {
    queryClient.invalidateQueries('dashboard-analytics')
    queryClient.invalidateQueries('topics')
    navigate('/dashboard')
  }

  const handleExportResults = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      
      // Header
      doc.setFontSize(20)
      doc.setTextColor(25, 118, 210)
      doc.text('Quiz Performance Report', 20, 30)
      
      // Date
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40)
      
      // Score Summary Box
      doc.setDrawColor(25, 118, 210)
      doc.setFillColor(240, 248, 255)
      doc.roundedRect(20, 50, 170, 40, 3, 3, 'FD')
      
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text('Score Summary', 25, 65)
      
      doc.setFontSize(12)
      doc.text(`Score: ${quizResults.score}/${quizResults.totalQuestions} (${scorePercentage.toFixed(0)}%)`, 25, 75)
      doc.setTextColor(...(quizResults.passed ? [76, 175, 80] : [244, 67, 54]))
      doc.text(`Status: ${quizResults.passed ? 'PASSED' : 'FAILED'}`, 25, 85)
      
      // Performance Details
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.text('Performance Details', 20, 110)
      
      doc.setFontSize(10)
      const timeSpent = `${Math.floor(quizResults.timeSpent / 60)}:${(quizResults.timeSpent % 60).toString().padStart(2, '0')}`
      doc.text(`Time Spent: ${timeSpent}`, 25, 125)
      doc.text(`Average Response Time: ${performance.averageResponseTime.toFixed(1)}s`, 25, 135)
      doc.text(`Unattempted Questions: ${performance.unattemptedQuestions}`, 25, 145)
      
      // Question Review
      doc.setFontSize(14)
      doc.text('Question Review', 20, 165)
      
      let yPos = 180
      doc.setFontSize(9)
      
      questionReview.forEach((q, i) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        
        // Question number and status
        doc.setTextColor(...(q.isCorrect ? [76, 175, 80] : [244, 67, 54]))
        doc.text(`${i + 1}. ${q.isCorrect ? '✓' : '✗'}`, 20, yPos)
        
        // Question text
        doc.setTextColor(0, 0, 0)
        const questionLines = doc.splitTextToSize(q.questionText, 160)
        doc.text(questionLines, 30, yPos)
        yPos += questionLines.length * 5
        
        // Your answer
        doc.setTextColor(100, 100, 100)
        const userAnswer = q.userAnswerIndex !== null ? q.options[q.userAnswerIndex] : 'Not attempted'
        doc.text(`Your Answer: ${userAnswer}`, 30, yPos)
        yPos += 5
        
        // Correct answer
        doc.setTextColor(76, 175, 80)
        doc.text(`Correct Answer: ${q.options[q.correctAnswerIndex]}`, 30, yPos)
        yPos += 10
      })
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`Page ${i} of ${pageCount}`, 170, 290)
      }
      
      doc.save(`quiz-results-${Date.now()}.pdf`)
      toast.success('PDF exported successfully!')
    } catch (error) {
      toast.error('Export failed. Please try again.')
    }
  }

  if (isLoading || !results) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Loading results...</Typography>
      </Box>
    )
  }

  const { quizResults, questionReview, performance } = results
  const scorePercentage = (quizResults.score / quizResults.totalQuestions) * 100

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Quiz Results
          </Typography>
          <IconButton color="inherit" onClick={handleReturnHome}>
            <Home />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Score Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h2" color="primary" gutterBottom>
                  {quizResults.score}/{quizResults.totalQuestions}
                </Typography>
                <Typography variant="h4" gutterBottom>
                  {scorePercentage.toFixed(0)}%
                </Typography>
                <Chip
                  label={quizResults.passed ? 'PASSED' : 'FAILED'}
                  color={quizResults.passed ? 'success' : 'error'}
                  size="large"
                  sx={{ fontSize: '1.2rem', px: 3, py: 1 }}
                />
                <Typography variant="body1" sx={{ mt: 2 }} color="textSecondary">
                  {quizResults.passed 
                    ? 'Congratulations! You passed the quiz.' 
                    : 'Keep practicing! You need 50% to pass.'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Stats */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Performance Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total Time Spent"
                      secondary={`${Math.floor(quizResults.timeSpent / 60)}:${(quizResults.timeSpent % 60).toString().padStart(2, '0')}`}
                    />
                    <Timer color="action" />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Average Response Time"
                      secondary={`${performance.averageResponseTime.toFixed(1)} seconds`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Unattempted Questions"
                      secondary={`${performance.unattemptedQuestions} questions`}
                    />
                  </ListItem>
                </List>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleExportResults}
                    fullWidth
                  >
                    Export Results as PDF
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  What's Next?
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleReturnHome}
                    fullWidth
                  >
                    Return to Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      queryClient.invalidateQueries('dashboard-analytics')
                      queryClient.invalidateQueries('topics')
                      navigate('/dashboard')
                    }}
                    fullWidth
                  >
                    Take Another Quiz
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Question Review */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Question Review
                </Typography>
                <List>
                  {questionReview.map((question, index) => (
                    <Box key={question.questionId}>
                      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                            Question {index + 1}: {question.questionText}
                          </Typography>
                          {question.isCorrect ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Cancel color="error" />
                          )}
                        </Box>
                        
                        <Box sx={{ width: '100%', ml: 2 }}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Options:
                          </Typography>
                          {question.options.map((option, optionIndex) => (
                            <Typography
                              key={optionIndex}
                              variant="body2"
                              sx={{
                                p: 1,
                                mb: 0.5,
                                borderRadius: 1,
                                backgroundColor: 
                                  optionIndex === question.correctAnswerIndex
                                    ? '#e8f5e8'
                                    : optionIndex === question.userAnswerIndex && question.userAnswerIndex !== question.correctAnswerIndex
                                    ? '#ffebee'
                                    : 'transparent',
                                border:
                                  optionIndex === question.correctAnswerIndex
                                    ? '1px solid #4caf50'
                                    : optionIndex === question.userAnswerIndex && question.userAnswerIndex !== question.correctAnswerIndex
                                    ? '1px solid #f44336'
                                    : '1px solid transparent',
                                color: 'text.primary'
                              }}
                            >
                              {String.fromCharCode(65 + optionIndex)}. {option}
                              {optionIndex === question.correctAnswerIndex && ' ✓ (Correct)'}
                              {optionIndex === question.userAnswerIndex && optionIndex !== question.correctAnswerIndex && ' ✗ (Your answer)'}
                            </Typography>
                          ))}
                          
                          <Typography variant="caption" color="textSecondary">
                            Response time: {question.responseTime}s
                            {question.userAnswerIndex === null && ' (Not attempted)'}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < questionReview.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default ResultsPage