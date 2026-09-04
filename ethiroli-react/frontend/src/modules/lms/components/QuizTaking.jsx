import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getQuiz, getQuizzes } from '../../../services/api/quizApi.js';
import styles from './Lms.module.css';

export default function QuizTaking({ quizId }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = quizId ? await getQuiz(quizId) : await getQuizzes();
        setQuiz(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quiz) return;
    let correct = 0;
    quiz.questions?.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    const finalScore = quiz.questions?.length ? Math.round((correct / quiz.questions.length) * 100) : 0;
    setScore(finalScore);
    setSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)'}}>
        <p style={{color: 'var(--admin-danger)', margin: 0}}>{error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{marginBottom: 24}}>
        <h3 style={{margin: '0 0 6px 0', fontSize: 20, fontWeight: 700}}>{quiz?.title || 'Assessment Quiz'}</h3>
        <p style={{margin: 0, color: 'var(--admin-text-muted)', fontSize: 14}}>
          {quiz?.description || 'Answer the following questions to verify completion'}
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {quiz?.questions?.map((q, idx) => (
            <div key={q.id} className={styles.questionBlock}>
              <p style={{margin: '0 0 12px 0', fontWeight: 600, fontSize: 14}}>
                <span style={{color: 'var(--admin-primary)', marginRight: 8}}>Q{idx + 1}.</span>
                {q.text}
              </p>
              <div className={styles.optionsGrid}>
                {q.options?.map(opt => (
                  <label key={opt} className={styles.optionLabel} style={{
                    background: '#fff',
                    padding: '12px 14px',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    border: answers[q.id] === opt ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border-subtle)',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleSelect(q.id, opt)}
                      style={{accentColor: 'var(--admin-primary)'}}
                    />
                    <span style={{fontSize: 13.5}}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="btn primary" style={{marginTop: 8}} disabled={Object.keys(answers).length !== (quiz?.questions?.length || 0)}>
            Submit Answers
          </button>
        </form>
      ) : (
        <div className={styles.successCard} style={{textAlign: 'center', padding: '40px 20px'}}>
          <div style={{fontSize: 48, marginBottom: 16}}>🎉</div>
          <h4 style={{margin: '0 0 8px', fontSize: 18, fontWeight: 700}}>Assessment Submitted!</h4>
          <p style={{margin: '0 0 20px', color: 'var(--admin-text-secondary)'}}>
            Your score: <strong style={{color: score >= 70 ? 'var(--admin-success)' : 'var(--admin-danger)'}}>{score}%</strong>
            {' '}({Math.round(score * (quiz?.questions?.length || 0) / 100)}/{quiz?.questions?.length || 0} correct)
          </p>
          <button onClick={handleRetake} className="btn secondary">Retake Quiz</button>
        </div>
      )}
    </div>
  );
}
