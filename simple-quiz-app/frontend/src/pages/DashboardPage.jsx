import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  LinearProgress
} from '@mui/material'
import { LogoutOutlined, Quiz, TrendingUp } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { quizService, analyticsService } from '../services/api'
import { toast } from 'react-hot-toast'

const DashboardPage = () => {
  const [topicDialogOpen, setTopicDialogOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  useEffect(() => {
    // Refresh data when dashboard loads
    queryClient.invalidateQueries('dashboard-analytics')
    queryClient.invalidateQueries('topics')
  }, [queryClient])

  const { data: topics, isLoading: topicsLoading } = useQuery(
    'topics',
    () => quizService.getTopics(),
    {
      select: (response) => response.data.data.topics
    }
  )

  const { data: analytics, isLoading: analyticsLoading } = useQuery(
    'dashboard-analytics',
    () => analyticsService.getDashboard(),
    {
      select: (response) => response.data.data
    }
  )

  const handleStartQuiz = async (topicId) => {
    try {
      const response = await quizService.startQuiz(topicId)
      navigate(`/quiz/${topicId}`, { 
        state: { quizData: response.data.data } 
      })
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to start quiz')
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  if (topicsLoading || analyticsLoading) {
    return <LinearProgress />
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Quiz Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.userId}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Performance Stats */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Performance Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {analytics?.overallStats?.totalQuizzes || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Total Quizzes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {analytics?.overallStats?.averageScore?.toFixed(1) || '0.0'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Average Score
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {analytics?.overallStats?.averageResponseTime?.toFixed(1) || '0.0'}s
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Avg Response Time
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {analytics?.overallStats?.unattemptedQuestions || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Unattempted
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Quiz />}
                  onClick={() => setTopicDialogOpen(true)}
                  sx={{ mb: 2 }}
                >
                  Start New Quiz
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={async () => {
                    try {
                      const { jsPDF } = await import('jspdf')
                      const doc = new jsPDF()
                      
                      // Header
                      doc.setFontSize(20)
                      doc.setTextColor(25, 118, 210)
                      doc.text('Dashboard Performance Report', 20, 30)
                      
                      // User info
                      doc.setFontSize(12)
                      doc.setTextColor(100, 100, 100)
                      doc.text(`User: ${user?.userId}`, 20, 45)
                      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55)
                      
                      // Overall Stats Box
                      doc.setDrawColor(25, 118, 210)
                      doc.setFillColor(240, 248, 255)
                      doc.roundedRect(20, 70, 170, 60, 3, 3, 'FD')
                      
                      doc.setFontSize(16)
                      doc.setTextColor(0, 0, 0)
                      doc.text('Overall Statistics', 25, 85)
                      
                      doc.setFontSize(11)
                      doc.text(`Total Quizzes: ${analytics?.overallStats?.totalQuizzes || 0}`, 25, 100)
                      doc.text(`Average Score: ${analytics?.overallStats?.averageScore?.toFixed(1) || '0.0'}/10`, 25, 110)
                      doc.text(`Average Response Time: ${analytics?.overallStats?.averageResponseTime?.toFixed(1) || '0.0'}s`, 25, 120)
                      
                      // Recent Quizzes
                      doc.setFontSize(14)
                      doc.text('Recent Quiz Performance', 20, 150)
                      
                      if (analytics?.recentQuizzes?.length > 0) {
                        doc.setFontSize(10)
                        let yPos = 165
                        analytics.recentQuizzes.forEach((quiz, i) => {
                          const scoreColor = quiz.score >= 5 ? [76, 175, 80] : [244, 67, 54]
                          doc.setTextColor(...scoreColor)
                          doc.text(`${i + 1}. ${quiz.topicName}: ${quiz.score}/10`, 25, yPos)
                          doc.setTextColor(100, 100, 100)
                          doc.text(`${new Date(quiz.completedAt).toLocaleDateString()}`, 120, yPos)
                          yPos += 10
                        })
                      } else {
                        doc.setFontSize(10)
                        doc.setTextColor(150, 150, 150)
                        doc.text('No quizzes taken yet', 25, 165)
                      }
                      
                      // Footer
                      doc.setFontSize(8)
                      doc.setTextColor(150, 150, 150)
                      doc.text('Generated by Quiz Application', 20, 280)
                      
                      doc.save(`dashboard-report-${Date.now()}.pdf`)
                      toast.success('PDF exported successfully!')
                    } catch (error) {
                      toast.error('Export failed')
                    }
                  }}
                >
                  Export Report
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Quizzes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Quiz Scores
                </Typography>
                {analytics?.recentQuizzes?.length > 0 ? (
                  <List>
                    {analytics.recentQuizzes.map((quiz, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={quiz.topicName}
                          secondary={`Score: ${quiz.score}/10 • ${new Date(quiz.completedAt).toLocaleDateString()}`}
                        />
                        <Chip 
                          label={`${quiz.score}/10`}
                          color={quiz.score >= 5 ? 'success' : 'error'}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary">
                    No quizzes taken yet. Start your first quiz!
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Topic Performance */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Topic Performance
                </Typography>
                {analytics?.topicStats?.length > 0 ? (
                  <List>
                    {analytics.topicStats.map((topic, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={topic.topicName}
                          secondary={`${topic.quizzesTaken} quizzes • Best: ${topic.bestScore}/10`}
                        />
                        <Chip 
                          label={`${topic.averageScore.toFixed(1)}/10`}
                          color={topic.averageScore >= 5 ? 'success' : 'warning'}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary">
                    No topic data available yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Topic Selection Dialog */}
      <Dialog 
        open={topicDialogOpen} 
        onClose={() => setTopicDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Quiz Topic</DialogTitle>
        <DialogContent>
          <List>
            {topics?.map((topic) => (
              <ListItem key={topic._id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleStartQuiz(topic._id)
                    setTopicDialogOpen(false)
                  }}
                  disabled={!topic.canRetake}
                >
                  <ListItemText
                    primary={topic.name}
                    secondary={
                      <Box component="div">
                        <Typography variant="body2" color="textSecondary" component="div">
                          {topic.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip 
                            label={`${topic.userAttempts}/${topic.maxAttempts} attempts`}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip 
                            label={`Best: ${topic.bestScore}/10`}
                            size="small"
                            color={topic.bestScore >= 5 ? 'success' : 'default'}
                          />
                          {!topic.canRetake && (
                            <Chip 
                              label="Max attempts reached"
                              size="small"
                              color="error"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default DashboardPage