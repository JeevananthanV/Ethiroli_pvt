import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { quizApi } from '../../../services/api/quizApi.js';

const QUESTIONS_PER_ROUND = 10;
const SECONDS_PER_QUESTION = 30;

const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);

const formatClock = (sec) => {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Live Quiz - rapid-fire speed round.
 *
 * Pulls the student's published quizzes from the API, runs a short timed round
 * of up to QUESTIONS_PER_ROUND questions (SECONDS_PER_QUESTION each) and posts
 * the answers to POST /v1/quizzes/:id/submit so the attempt is graded and
 * stored server-side like any other assessment.
 */
export default function StudentLiveQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [round, setRound] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [timeTaken, setTimeTaken] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const submittingRef = useRef(false);

  const loadQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizApi.list({ is_published: true });
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const finishRound = useCallback(async () => {
    if (!round || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const evaluation = await quizApi.submit(round.id, {
        answers,
        time_taken_seconds: timeTaken
      });
      setResult(evaluation);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit round');
      submittingRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }, [round, answers, timeTaken]);

  const advance = useCallback(() => {
    if (!round || result) return;
    if (index >= questions.length - 1) {
      finishRound();
      return;
    }
    setIndex((prev) => prev + 1);
    setTimeLeft(SECONDS_PER_QUESTION);
  }, [round, result, index, questions.length, finishRound]);

  // Countdown for the active round.
  useEffect(() => {
    if (!round || result) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
      setTimeTaken((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [round, result]);

  // Time ran out on this question -> move on (or grade the round).
  useEffect(() => {
    if (!round || result || timeLeft > 0) return;
    advance();
  }, [timeLeft, round, result, advance]);

  const startRound = async (quiz) => {
    setLoading(true);
    setError(null);
    try {
      const full = await quizApi.getForTake(quiz.id);
      const available = Array.isArray(full?.questions) ? full.questions : [];
      if (available.length === 0) {
        setError('This quiz has no questions yet. Try another quiz.');
        return;
      }
      setRound(full);
      setQuestions(shuffle(available).slice(0, QUESTIONS_PER_ROUND));
      setIndex(0);
      setAnswers({});
      setResult(null);
      setTimeTaken(0);
      setTimeLeft(SECONDS_PER_QUESTION);
      submittingRef.current = false;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to start the round');
    } finally {
      setLoading(false);
    }
  };

  const exitRound = () => {
    setRound(null);
    setQuestions([]);
    setResult(null);
    setAnswers({});
    submittingRef.current = false;
    loadQuizzes();
  };

  const selectOption = (question, optionId) => {
    const isMulti = question.question_type === 'MULTI_SELECT';
    setAnswers((prev) => {
      if (!isMulti) return { ...prev, [question.id]: optionId };
      const current = Array.isArray(prev[question.id]) ? prev[question.id] : [];
      return {
        ...prev,
        [question.id]: current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId]
      };
    });
  };

  const current = questions[index];
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;

  /* ---------------------------------------------------------------- Result */
  if (result) {
    return (
      <AdminPage title="Live Coding Quiz" subtitle="Timed speed round results">
        <div className="card" style={{ maxWidth: 760, margin: '0 auto', padding: 28 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 52 }}>{result.is_passed ? '🏆' : '📚'}</span>
            <h2 style={{ margin: '8px 0 4px' }}>
              {result.is_passed ? 'Speed Round Cleared!' : 'Round Completed'}
            </h2>
            <p style={{ color: 'var(--admin-text-secondary)', fontSize: 14 }}>
              {round?.title} · passing score {result.passing_score}%
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20 }}>
              <div style={{ padding: '12px 22px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: result.is_passed ? '#00e676' : '#ff9800' }}>
                  {result.score}%
                </div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Score</div>
              </div>
              <div style={{ padding: '12px 22px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{result.earned_points} / {result.total_points}</div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Points</div>
              </div>
              <div style={{ padding: '12px 22px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{formatClock(result.time_taken_seconds || 0)}</div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Time Spent</div>
              </div>
            </div>
          </div>

          <h4 style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 16 }}>
            Round Review
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(result.itemized_results || []).map((item, idx) => (
              <div
                key={item.question_id || idx}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: item.is_correct ? 'rgba(0, 230, 118, 0.05)' : 'rgba(255, 82, 82, 0.05)',
                  border: `1px solid ${item.is_correct ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14 }}>
                  <strong>{idx + 1}. {item.question_text}</strong>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>
                    {item.is_correct ? `+${item.points_earned}` : '0'} pts
                  </span>
                </div>
                {item.explanation && (
                  <div style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginTop: 8 }}>
                    💡 {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <button onClick={exitRound} className="btn primary" style={{ padding: '10px 24px' }}>
              Back to Live Quiz
            </button>
          </div>
        </div>
      </AdminPage>
    );
  }

  /* ----------------------------------------------------------- Active round */
  if (round) {
    return (
      <AdminPage
        title="Live Coding Quiz"
        subtitle={round.title}
        loading={submitting}
        error={error}
        onRetry={() => setError(null)}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 240px', gap: 24, alignItems: 'start' }}>
          <div className="card" style={{ padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text-muted)' }}>
                Question {index + 1} of {questions.length}
              </span>
              <span style={{
                fontSize: 14,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                color: timeLeft <= 5 ? '#ff5252' : 'var(--admin-primary)'
              }}>
                ⏳ {formatClock(timeLeft)}
              </span>
            </div>

            {current ? (
              <>
                <h3 style={{ fontSize: 17, lineHeight: 1.5, margin: '0 0 14px' }}>
                  {current.question_text}
                </h3>

                {current.code_snippet && (
                  <pre style={{ background: '#1e1e1e', padding: 14, borderRadius: 6, fontFamily: 'monospace', fontSize: 13, color: '#81d4fa', overflowX: 'auto' }}>
                    {current.code_snippet}
                  </pre>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  {(current.options || []).map((opt) => {
                    const isMulti = current.question_type === 'MULTI_SELECT';
                    const selected = isMulti
                      ? Array.isArray(answers[current.id]) && answers[current.id].includes(opt.id)
                      : answers[current.id] === opt.id;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => selectOption(current, opt.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 16px',
                          borderRadius: 8,
                          textAlign: 'left',
                          background: selected ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                          border: selected ? '1px solid var(--admin-primary)' : '1px solid var(--admin-border-subtle)',
                          color: selected ? 'var(--admin-primary)' : 'var(--admin-text-primary)',
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        <span style={{
                          width: 20,
                          height: 20,
                          borderRadius: isMulti ? 4 : '50%',
                          border: `2px solid ${selected ? 'var(--admin-primary)' : 'var(--admin-border-subtle)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          flexShrink: 0
                        }}>
                          {selected ? '✓' : ''}
                        </span>
                        <span>{opt.option_text}</span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 16 }}>
                  <button
                    onClick={() => { setIndex((i) => Math.max(0, i - 1)); setTimeLeft(SECONDS_PER_QUESTION); }}
                    disabled={index === 0}
                    className="btn secondary"
                    style={{ padding: '8px 16px' }}
                  >
                    ◀ Previous
                  </button>
                  <button
                    onClick={advance}
                    disabled={submitting}
                    className="btn primary"
                    style={{ padding: '8px 20px' }}
                  >
                    {index >= questions.length - 1 ? 'Finish Round ✓' : 'Next ▶'}
                  </button>
                </div>
              </>
            ) : (
              <p>No questions in this round.</p>
            )}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 13, textTransform: 'uppercase', color: 'var(--admin-text-muted)' }}>
              Round Progress
            </h4>
            <div style={{ fontSize: 26, fontWeight: 800 }}>
              {answeredCount}/{questions.length}
            </div>
            <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginBottom: 16 }}>
              answered · {formatClock(timeTaken)} elapsed
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === index;
                return (
                  <button
                    key={q.id || idx}
                    onClick={() => { setIndex(idx); setTimeLeft(SECONDS_PER_QUESTION); }}
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

            <button
              onClick={() => {
                if (window.confirm('Exit the speed round? Progress will be discarded.')) exitRound();
              }}
              className="btn secondary"
              style={{ width: '100%', marginTop: 20, fontSize: 12, padding: 8 }}
            >
              Exit Round
            </button>
          </div>
        </div>
      </AdminPage>
    );
  }

  /* ----------------------------------------------------------- Quiz picker */
  return (
    <AdminPage
      title="Live Coding Quiz"
      subtitle="30-second speed rounds pulled from your published quizzes"
      loading={loading}
      error={error}
      onRetry={loadQuizzes}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {quizzes.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
            <span style={{ fontSize: 40 }}>⚡</span>
            <h3>No Live Quizzes Available</h3>
            <p style={{ color: 'var(--admin-text-muted)' }}>
              A speed round starts as soon as an instructor publishes a quiz with questions.
            </p>
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'rgba(255, 152, 0, 0.15)', color: '#ff9800' }}>
                    ⚡ {QUESTIONS_PER_ROUND} Q · {SECONDS_PER_QUESTION}s each
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                    Pass: {quiz.passing_score || 70}%
                  </span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>{quiz.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', lineHeight: 1.5 }}>
                  {quiz.description || 'Rapid-fire questions graded against the standard passing score.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
                  {quiz.questions_count || 0} questions available
                </span>
                <button onClick={() => startRound(quiz)} className="btn primary" style={{ fontSize: 13, padding: '8px 16px' }}>
                  Start Round ▶
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPage>
  );
}
