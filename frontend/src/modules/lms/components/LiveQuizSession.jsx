import React, { useState, useEffect, useRef, useCallback } from 'react';
import liveQuizApi from '../../../../services/api/liveQuizApi'
import LiveQuizLeaderboard from './LiveQuizLeaderboard'

export default function LiveQuizSession({ quizId }) {
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    fetchQuiz()
  }, [quizId, fetchQuiz])

  const fetchQuiz = useCallback(async () => {
    try {
      const data = await liveQuizApi.getById(quizId)
      setQuiz(data)
      if (data.questions?.length > 0) {
        setCurrentQuestion(data.questions[0])
        setTimeLeft(data.timePerQuestion || 30)
      }
    } catch (error) {
      console.error('Failed to fetch quiz:', error)
    } finally {
      setLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [timeLeft, submitted, handleSubmit])

  const handleAnswerSelect = (answer) => {
    if (submitted) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = useCallback(async () => {
    if (submitted || !selectedAnswer) return
    setSubmitted(true)
    clearInterval(timerRef.current)

    try {
      const result = await liveQuizApi.submitAnswer(quizId, { questionId: currentQuestion.id, answer: selectedAnswer })
      if (result.correct) {
        setScore((prev) => prev + (result.points || 10))
      }
      setTimeLeft(0)
    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
  }, [quizId, currentQuestion, selectedAnswer, submitted])

  const nextQuestion = () => {
    if (questionIndex < quiz.questions.length - 1) {
      const nextIndex = questionIndex + 1
      setQuestionIndex(nextIndex)
      setCurrentQuestion(quiz.questions[nextIndex])
      setSelectedAnswer(null)
      setSubmitted(false)
      setTimeLeft(quiz.timePerQuestion || 30)
    }
  }

  const startQuiz = async () => {
    try {
      await liveQuizApi.start(quizId)
      setTimeLeft(quiz.timePerQuestion || 30)
    } catch (error) {
      alert('Failed to start quiz: ' + error.message)
    }
  }

  if (loading) {
    return <div className="loading">Loading quiz...</div>
  }

  if (!quiz) {
    return <div className="emptyState">Quiz not found</div>
  }

  if (quiz.status === 'not_started') {
    return (
      <div className="card">
        <div className="cardBody textCenter">
          <h3 className="textPrimary mb3">{quiz.title}</h3>
          <p className="textSecondary mb4">{quiz.description}</p>
          <p className="textMuted mb4">{quiz.questions?.length || 0} questions</p>
          <button className="btn primary" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  if (showLeaderboard) {
    return (
      <div>
        <button className="btn secondary mb3" onClick={() => setShowLeaderboard(false)}>
          Back to Quiz
        </button>
        <LiveQuizLeaderboard quizId={quizId} />
      </div>
    )
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <h3 className="cardTitle">{quiz.title}</h3>
          <p className="textSecondary textSm">
            Question {questionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="flex gap3">
          <span className="textXl fontSemibold textPrimary">Score: {score}</span>
          <span className="textXl fontSemibold textWarning">{timeLeft}s</span>
        </div>
      </div>
      <div className="cardBody">
        {currentQuestion && (
          <div>
            <h3 className="textPrimary mb4">{currentQuestion.text}</h3>
            <div className="flex flexCol gap3 mb4">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  className={`card ${selectedAnswer === index ? 'border textPrimary' : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={submitted}
                  style={{
                    border: '1px solid var(--admin-border)',
                    textAlign: 'left',
                    cursor: submitted ? 'not-allowed' : 'pointer',
                    opacity: submitted && currentQuestion.correctAnswer === index ? '1' : submitted ? '0.5' : '1',
                  }}
                >
                  <div className="cardBody">
                    <span className="fontMedium">{option}</span>
                    {submitted && currentQuestion.correctAnswer === index && (
                      <span className="statusTag active ml2">Correct</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap3">
              {!submitted ? (
                <button className="btn primary" onClick={handleSubmit} disabled={!selectedAnswer}>
                  Submit Answer
                </button>
              ) : (
                <>
                  <button className="btn primary" onClick={nextQuestion} disabled={questionIndex === quiz.questions.length - 1}>
                    Next Question
                  </button>
                  <button className="btn secondary" onClick={() => setShowLeaderboard(true)}>
                    View Leaderboard
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
