import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { quizApi } from '../../../services/api/quizApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function StudentQuiz() {
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const data = await quizApi.getAll()
      setQuizzes(data)
    } catch (err) {
      alert('Failed to load quizzes: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz)
    setAnswers({})
    setSubmitted(false)
    setResult(null)
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleSubmit = async () => {
    try {
      const data = await quizApi.submit(selectedQuiz.id, answers)
      setResult(data)
      setSubmitted(true)
    } catch (err) {
      alert('Failed to submit quiz: ' + err.message)
    }
  }

  return (
    <AdminPage
      title="Quiz"
      subtitle="Take quizzes and view your results"
      loading={loading}
      onRetry={fetchQuizzes}
    >
      {!selectedQuiz ? (
        <div className="grid gridCols3">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card">
              <div className="cardBody">
                <h3 className="fontSemibold textPrimary mb2">{quiz.title}</h3>
                <p className="textSecondary textSm mb3">{quiz.description}</p>
                <div className="flex justifyBetween itemsCenter mb3">
                  <span className="textMuted textSm">{quiz.questions?.length || 0} questions</span>
                  <span className={`statusTag ${quiz.status === 'published' ? 'active' : 'pending'}`}>
                    {quiz.status}
                  </span>
                </div>
                <Button onClick={() => handleStartQuiz(quiz)}>Start Quiz</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">{selectedQuiz.title}</h3>
            {!submitted && (
              <span className="textMuted textSm">{selectedQuiz.questions?.length || 0} questions</span>
            )}
          </div>
          <div className="cardBody">
            {!submitted ? (
              <div>
                {selectedQuiz.questions?.map((question, qIdx) => (
                  <div key={question.id || qIdx} className="formGroup mb4">
                    <label className="label">
                      {qIdx + 1}. {question.text}
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      {question.options?.map((option, oIdx) => (
                        <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name={`question-${question.id || qIdx}`}
                            value={option}
                            checked={answers[question.id || qIdx] === option}
                            onChange={() => handleAnswerChange(question.id || qIdx, option)}
                          />
                          <span className="textSecondary">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <Button variant="secondary" onClick={() => setSelectedQuiz(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    Submit Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="textCenter py4">
                  <h3 className="textSuccess mb3">Quiz Submitted!</h3>
                  {result && (
                    <div>
                      <p className="statValue" style={{ fontSize: '48px' }}>
                        {result.score || 0}/{result.total || selectedQuiz.questions?.length || 0}
                      </p>
                      <p className="textSecondary">Your Score</p>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                  <Button onClick={() => setSelectedQuiz(null)}>
                    Back to Quizzes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Quiz Details">
        <p className="textSecondary">Detailed quiz results coming soon.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </AdminPage>
  )
}
