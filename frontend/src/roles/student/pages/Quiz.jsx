import React, { useEffect, useState, useCallback, useRef } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { quizApi } from '../../../services/api/quizApi.js';

export default function StudentQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const timerRef = useRef(null);

  // 1. Fetch Published Quizzes
  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizApi.list({ is_published: true });
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // 2. Timer Loop during active quiz
  useEffect(() => {
    if (activeQuiz && !quizResult && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
        setTimeTakenSeconds(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeQuiz, quizResult, secondsRemaining]);

  // 3. Start Taking Quiz
  const handleStartQuiz = async (quiz) => {
    setLoading(true);
    try {
      const fullQuiz = await quizApi.getForTake(quiz.id);
      setActiveQuiz(fullQuiz);
      setQuestions(fullQuiz.questions || []);
      setCurrentQIndex(0);
      setStudentAnswers({});
      setQuizResult(null);
      setTimeTakenSeconds(0);
      setSecondsRemaining((fullQuiz.time_limit_minutes || 10) * 60);
    } catch (err) {
      alert('Failed to load quiz questions: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 4. Select Option Choice
  const handleSelectOption = (questionId, optionId, isMulti = false) => {
    if (isMulti) {
      const currentSelected = Array.isArray(studentAnswers[questionId]) ? studentAnswers[questionId] : [];
      const nextSelected = currentSelected.includes(optionId)
        ? currentSelected.filter(id => id !== optionId)
        : [...currentSelected, optionId];
      setStudentAnswers(prev => ({ ...prev, [questionId]: nextSelected }));
    } else {
      setStudentAnswers(prev => ({ ...prev, [questionId]: optionId }));
    }
  };

  // 5. Submit Answers to Server
  const handleSubmitQuiz = async () => {
    if (isSubmitting || !activeQuiz) return;
    setIsSubmitting(true);
    clearInterval(timerRef.current);

    try {
      const evaluation = await quizApi.submit(activeQuiz.id, {
        answers: studentAnswers,
        time_taken_seconds: timeTakenSeconds
      });
      setQuizResult(evaluation);
    } catch (err) {
      alert('Failed to submit quiz: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format MM:SS
  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQIndex];

  return (
    <AdminPage
      title="Assessments & Knowledge Checks"
      subtitle="Validated examinations and module quizzes"
      loading={loading}
      error={error}
      onRetry={fetchQuizzes}
    >
      {!activeQuiz ? (
        /* View 1: Quizzes Catalog */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {quizzes.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
              <span style={{ fontSize: 40 }}>📝</span>
              <h3>No Quizzes Published Yet</h3>
              <p style={{ color: 'var(--admin-text-muted)' }}>Instructors will publish quizzes as you progress through course modules.</p>
            </div>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'rgba(0, 122, 255, 0.15)', color: 'var(--admin-primary)' }}>
                      ⏱️ {quiz.time_limit_minutes || 10} Mins
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                      Pass: {quiz.passing_score || 70}%
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 17 }}>{quiz.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                    {quiz.description || 'Test your knowledge on key topics from this curriculum section.'}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
                    {quiz.questions_count || 0} Questions
                  </span>
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="btn primary"
                    style={{ fontSize: 13, padding: '8px 16px' }}
                  >
                    Start Exam ▶
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : quizResult ? (
        /* View 2: Verified Result Breakdown */
        <div className="card" style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 56 }}>{quizResult.is_passed ? '🏆' : '📚'}</span>
            <h2 style={{ margin: '12px 0 4px 0', fontSize: 26 }}>
              {quizResult.is_passed ? 'Congratulations, You Passed!' : 'Exam Completed'}
            </h2>
            <p style={{ color: 'var(--admin-text-secondary)', fontSize: 14 }}>
              {quizResult.is_passed
                ? `You met the passing criteria of ${quizResult.passing_score}%. Great work!`
                : `You scored below the passing threshold of ${quizResult.passing_score}%. Review the explanations below.`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24 }}>
              <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: quizResult.is_passed ? '#00e676' : '#ff9800' }}>
                  {quizResult.score}%
                </div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Final Score</div>
              </div>

              <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>
                  {quizResult.earned_points} / {quizResult.total_points}
                </div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Points Earned</div>
              </div>

              <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>
                  {formatTimer(quizResult.time_taken_seconds || 0)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Time Spent</div>
              </div>
            </div>
          </div>

          {/* Itemized Questions Breakdown */}
          <h3 style={{ borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: 10, marginBottom: 20 }}>
            Question-by-Question Review
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {quizResult.itemized_results?.map((item, idx) => (
              <div
                key={item.question_id || idx}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: item.is_correct ? 'rgba(0, 230, 118, 0.05)' : 'rgba(255, 82, 82, 0.05)',
                  border: `1px solid ${item.is_correct ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 82, 82, 0.3)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {idx + 1}. {item.question_text}
                  </div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: item.is_correct ? '#00e676' : '#ff5252',
                    color: '#000'
                  }}>
                    {item.is_correct ? `+${item.points_earned} Pts` : '0 Pts'}
                  </span>
                </div>

                {item.explanation && (
                  <div style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginTop: 8, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                    💡 <strong>Instructor Note:</strong> {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <button
              onClick={() => {
                setActiveQuiz(null);
                setQuizResult(null);
                fetchQuizzes();
              }}
              className="btn primary"
              style={{ padding: '10px 24px' }}
            >
              Back to Quizzes Catalog
            </button>
          </div>
        </div>
      ) : (
        /* View 3: Timed Question Taking Interface */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24, alignItems: 'start' }}>
          
          {/* Main Question Card */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text-muted)' }}>
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <span style={{
                fontSize: 14,
                fontWeight: 700,
                color: secondsRemaining <= 60 ? '#ff5252' : 'var(--admin-primary)',
                padding: '4px 12px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.05)'
              }}>
                ⏳ Time Left: {formatTimer(secondsRemaining)}
              </span>
            </div>

            {currentQuestion ? (
              <div>
                <h3 style={{ fontSize: 18, lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {currentQuestion.question_text}
                </h3>

                {currentQuestion.code_snippet && (
                  <div style={{ background: '#1e1e1e', padding: 14, borderRadius: 6, fontFamily: 'monospace', fontSize: 13, color: '#81d4fa', marginBottom: 20 }}>
                    <pre style={{ margin: 0 }}>{currentQuestion.code_snippet}</pre>
                  </div>
                )}

                {/* Option Choices */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  {currentQuestion.options?.map((opt) => {
                    const isMulti = currentQuestion.question_type === 'MULTI_SELECT';
                    const isSelected = isMulti
                      ? Array.isArray(studentAnswers[currentQuestion.id]) && studentAnswers[currentQuestion.id].includes(opt.id)
                      : studentAnswers[currentQuestion.id] === opt.id;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(currentQuestion.id, opt.id, isMulti)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 16px',
                          borderRadius: 8,
                          textAlign: 'left',
                          background: isSelected ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                          border: isSelected ? '1px solid var(--admin-primary)' : '1px solid var(--admin-border-subtle)',
                          color: isSelected ? 'var(--admin-primary)' : 'var(--admin-text-primary)',
                          cursor: 'pointer',
                          fontSize: 14,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{
                          width: 20,
                          height: 20,
                          borderRadius: isMulti ? 4 : '50%',
                          border: `2px solid ${isSelected ? 'var(--admin-primary)' : 'var(--admin-border-subtle)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12
                        }}>
                          {isSelected && '✓'}
                        </span>
                        <span style={{ flex: 1 }}>{opt.option_text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 18 }}>
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                    className="btn secondary"
                    style={{ padding: '8px 16px' }}
                  >
                    ◀ Previous
                  </button>

                  <div style={{ display: 'flex', gap: 10 }}>
                    {currentQIndex < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        className="btn primary"
                        style={{ padding: '8px 16px' }}
                      >
                        Next ▶
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={isSubmitting}
                        className="btn primary"
                        style={{ padding: '8px 20px', background: '#00e676', color: '#000', fontWeight: 700 }}
                      >
                        {isSubmitting ? 'Evaluating...' : 'Submit Exam ✓'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p>No questions found in this quiz.</p>
            )}
          </div>

          {/* Side Question Navigator */}
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 14, textTransform: 'uppercase', color: 'var(--admin-text-muted)' }}>
              Question Grid
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {questions.map((q, idx) => {
                const isAnswered = studentAnswers[q.id] !== undefined;
                const isCurrent = currentQIndex === idx;

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentQIndex(idx)}
                    style={{
                      padding: '8px 0',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isCurrent ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border-subtle)',
                      background: isAnswered ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: isAnswered ? '#00e676' : 'var(--admin-text-primary)'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 24, borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 16 }}>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to exit the exam? Unsaved answers will be lost.')) {
                    setActiveQuiz(null);
                  }
                }}
                className="btn secondary"
                style={{ width: '100%', fontSize: 12, padding: 8 }}
              >
                Exit Quiz
              </button>
            </div>
          </div>

        </div>
      )}
    </AdminPage>
  );
}
