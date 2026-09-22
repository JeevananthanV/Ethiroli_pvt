import React, { useState, useEffect, useCallback } from 'react'
import quizApi from '../../../../services/api/quizApi'

export default function QuizTaking({ quizId, onComplete }) {
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuiz()
  }, [quizId, fetchQuiz])

  const fetchQuiz = useCallback(async () => {
    try {
      const data = await quizApi.getById(quizId)
      setQuiz(data)
    } catch (error) {
      console.error('Failed to fetch quiz:', error)
    } finally {
      setLoading(false)
    }
  }, [quizId])

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    try {
      const result = await quizApi.submit(quizId, answers)
      setResults(result)
      onComplete?.(result)
    } catch (error) {
      alert('Failed to submit quiz: ' + error.message)
    }
  }

  if (loading) {
    return <div className="loading">Loading quiz...</div>
  }

  if (!quiz) {
    return <div className="emptyState">Quiz not found</div>
  }

  if (results) {
    return (
      <div className="card">
        <div className="cardBody textCenter">
          <h2 className="textXl fontSemibold textPrimary mb3">Quiz Completed!</h2>
          <div className="statCard mb4" style={{ maxWidth: '300px', margin: '0 auto' }}>
            <div className="statLabel">Your Score</div>
            <div className="statValue textPrimary">{results.score || 0}%</div>
          </div>
          <p className="textSecondary">{results.correctCount || 0} out of {quiz.questions?.length || 0} correct</p>
        </div>
      </div>
    )
  }

  const question = quiz.questions?.[currentQuestion]
  const progress = ((currentQuestion + 1) / (quiz.questions?.length || 1)) * 100

  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <h3 className="cardTitle">{quiz.title}</h3>
          <p className="textSecondary textSm">
            Question {currentQuestion + 1} of {quiz.questions?.length || 0}
          </p>
        </div>
        <span className="textPrimary fontSemibold">{Math.round(progress)}%</span>
      </div>
      <div className="cardBody">
        {question && (
          <div>
            <h3 className="textPrimary mb4">{question.text}</h3>
            <div className="flex flexCol gap3 mb4">
              {question.options?.map((option, index) => (
                <label
                  key={index}
                  className={`card cursorPointer ${answers[question.id] === index ? 'border textPrimary' : ''}`}
                  style={{ border: '1px solid var(--admin-border)' }}
                >
                  <div className="cardBody">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={answers[question.id] === index}
                      onChange={() => handleAnswerChange(question.id, index)}
                      className="mr3"
                    />
                    <span>{option}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justifyBetween">
              <button
                className="btn secondary"
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              {currentQuestion === (quiz.questions?.length || 1) - 1 ? (
                <button className="btn primary" onClick={handleSubmit}>
                  Submit Quiz
                </button>
              ) : (
                <button
                  className="btn primary"
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
