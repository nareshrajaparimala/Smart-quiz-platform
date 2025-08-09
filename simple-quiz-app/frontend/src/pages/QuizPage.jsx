import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { ArrowBack, Timer } from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import { quizService } from '../services/api'

const QuizPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { topicId } = useParams()
  
  const [quizData, setQuizData] = useState(location.state?.quizData || null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(20)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastAnswerResult, setLastAnswerResult] = useState(null)

  const currentQuestion = quizData?.questions?.[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / (quizData?.totalQuestions || 10)) * 100

  // Timer effect
  useEffect(() => {
    if (!currentQuestion || isSubmitting) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, isSubmitting])

  // Reset timer for new question
  useEffect(() => {
    setTimeRemaining(20)
    setSelectedAnswer('')
  }, [currentQuestionIndex])

  const handleTimeUp = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await submitAnswer(null, 20)
    } catch (error) {
      toast.error('Failed to submit answer')
    }
    setIsSubmitting(false)
  }

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === '' || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await submitAnswer(parseInt(selectedAnswer), 20 - timeRemaining)
    } catch (error) {
      toast.error('Failed to submit answer')
    }
    setIsSubmitting(false)
  }

  const submitAnswer = async (answerIndex, responseTime) => {
    try {
      const response = await quizService.submitAnswer({
        quizAttemptId: quizData.quizAttemptId,
        questionId: currentQuestion._id,
        selectedAnswerIndex: answerIndex,
        responseTime
      })

      const result = response.data.data
      
      // Show feedback for 2 seconds
      setLastAnswerResult({
        isCorrect: result.isCorrect,
        selectedIndex: answerIndex,
        correctIndex: currentQuestion.correctAnswerIndex
      })
      setShowFeedback(true)
      
      setTimeout(() => {
        setShowFeedback(false)
        setLastAnswerResult(null)
        
        if (result.nextQuestion) {
          // Move to next question
          const updatedQuestions = [...quizData.questions]
          updatedQuestions[currentQuestionIndex + 1] = result.nextQuestion
          
          setQuizData(prev => ({
            ...prev,
            questions: updatedQuestions
          }))
          setCurrentQuestionIndex(prev => prev + 1)
        } else {
          // Quiz completed
          navigate(`/results/${quizData.quizAttemptId}`, {
            state: { results: result }
          })
        }
      }, 2000)
    } catch (error) {
      throw error
    }
  }

  const handleExit = () => {
    setShowExitDialog(true)
  }

  const confirmExit = () => {
    navigate('/dashboard')
    toast('Quiz abandoned. Progress was not saved.', { icon: '⚠️' })
  }

  if (!quizData || !currentQuestion) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Loading quiz...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={handleExit}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {quizData.topicName} - Question {currentQuestionIndex + 1} of {quizData.totalQuestions}
          </Typography>
          <Box display="flex" alignItems="center">
            <Timer sx={{ mr: 1 }} />
            <Typography variant="h6" color={timeRemaining <= 5 ? 'error.main' : 'inherit'}>
              {timeRemaining}s
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              {currentQuestion.questionText}
            </Typography>

            {currentQuestion.mediaUrl && (
              <Box sx={{ my: 3, textAlign: 'center' }}>
                {currentQuestion.mediaType === 'image' ? (
                  <img 
                    src={currentQuestion.mediaUrl} 
                    alt="Question media"
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                  />
                ) : (
                  <video 
                    src={currentQuestion.mediaUrl} 
                    controls
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                  />
                )}
              </Box>
            )}

            <FormControl component="fieldset" fullWidth sx={{ mt: 3 }}>
              <RadioGroup
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={option}
                    disabled={showFeedback}
                    sx={{ 
                      mb: 1,
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  />
                ))
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              {showFeedback ? (
                <Typography 
                  variant="h6" 
                  color={lastAnswerResult?.isCorrect ? 'success.main' : 'error.main'}
                  sx={{ mb: 2 }}
                >
                  {lastAnswerResult?.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === '' || isSubmitting || timeRemaining === 0}
                  sx={{ minWidth: 200 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </Button>
              )}
            </Box>

            {timeRemaining <= 5 && (
              <Typography 
                variant="body2" 
                color="error" 
                align="center" 
                sx={{ mt: 2 }}
              >
                Time running out! Answer will be auto-submitted.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
        <DialogTitle>Exit Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to exit? Your progress will not be saved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>
            Continue Quiz
          </Button>
          <Button onClick={confirmExit} color="error">
            Exit Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default QuizPage