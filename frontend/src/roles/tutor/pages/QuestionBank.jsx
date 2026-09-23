import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { questionBankApi } from '../../../services/api/questionBankApi.js';

export default function TutorQuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Form State
  const [questionForm, setQuestionForm] = useState({
    topic: '',
    difficulty: 'MEDIUM',
    question_type: 'MCQ',
    question_text: '',
    code_snippet: '',
    explanation: '',
    options: [
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ]
  });

  const [bulkPayload, setBulkPayload] = useState('');
  const [saving, setSaving] = useState(false);

  // 1. Fetch Questions
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await questionBankApi.list({
        search: search || undefined,
        difficulty: selectedDifficulty || undefined
      });
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load question bank');
    } finally {
      setLoading(false);
    }
  }, [search, selectedDifficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // 2. Handle Create Question
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.topic || !questionForm.question_text) return;

    const hasCorrect = questionForm.options.some(o => o.is_correct);
    if (!hasCorrect) {
      alert('Please mark at least one option as the correct answer.');
      return;
    }

    setSaving(true);
    try {
      await questionBankApi.create(questionForm);
      setShowCreateModal(false);
      setQuestionForm({
        topic: '',
        difficulty: 'MEDIUM',
        question_type: 'MCQ',
        question_text: '',
        code_snippet: '',
        explanation: '',
        options: [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
        ]
      });
      fetchQuestions();
    } catch (err) {
      alert('Failed to create question: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // 3. Handle Option Radio / Checkbox
  const handleToggleCorrect = (index) => {
    if (questionForm.question_type === 'MULTI_SELECT') {
      setQuestionForm(prev => ({
        ...prev,
        options: prev.options.map((opt, i) => i === index ? { ...opt, is_correct: !opt.is_correct } : opt)
      }));
    } else {
      setQuestionForm(prev => ({
        ...prev,
        options: prev.options.map((opt, i) => ({ ...opt, is_correct: i === index }))
      }));
    }
  };

  const handleOptionTextChange = (index, text) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? { ...opt, option_text: text } : opt)
    }));
  };

  // 4. Handle Delete Question
  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question from Question Bank?')) return;
    try {
      await questionBankApi.delete(id);
      fetchQuestions();
    } catch (err) {
      alert('Failed to delete question: ' + (err.response?.data?.message || err.message));
    }
  };

  // 5. Handle Bulk Import
  const handleBulkImport = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsed = JSON.parse(bulkPayload);
      const items = Array.isArray(parsed) ? parsed : (parsed.questions || []);
      await questionBankApi.bulkImport(items);
      setShowBulkModal(false);
      setBulkPayload('');
      fetchQuestions();
      alert('Questions bulk imported successfully!');
    } catch (err) {
      alert('Bulk import failed: Ensure JSON format matches expected schema. ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="Question & Assessment Bank"
      subtitle="Master repository of validated questions with server-side answer keys"
      loading={loading}
      error={error}
      onRetry={fetchQuestions}
    >
      {/* Search & Action Bar */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search questions or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              background: 'var(--admin-card-bg)',
              color: 'var(--admin-text-primary)',
              border: '1px solid var(--admin-border-subtle)',
              fontSize: 14,
              minWidth: 260
            }}
          />

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              background: 'var(--admin-card-bg)',
              color: 'var(--admin-text-primary)',
              border: '1px solid var(--admin-border-subtle)',
              fontSize: 14
            }}
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowBulkModal(true)} className="btn secondary" style={{ fontSize: 13 }}>
            📤 Bulk JSON Import
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn primary" style={{ fontSize: 13 }}>
            + Create Question
          </button>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <span style={{ fontSize: 44 }}>❓</span>
          <h3 style={{ margin: '12px 0 6px 0' }}>No questions found in Question Bank</h3>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: 14, marginBottom: 18 }}>
            Add questions with verified answer keys to attach them to course quizzes.
          </p>
          <button onClick={() => setShowCreateModal(true)} className="btn primary">
            + Create First Question
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {questions.map((q, qIdx) => (
            <div key={q.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(0,122,255,0.15)', color: 'var(--admin-primary)' }}>
                      {q.topic}
                    </span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: q.difficulty === 'EASY' ? 'rgba(0,230,118,0.15)' : q.difficulty === 'HARD' ? 'rgba(255,82,82,0.15)' : 'rgba(255,152,0,0.15)',
                      color: q.difficulty === 'EASY' ? '#00e676' : q.difficulty === 'HARD' ? '#ff5252' : '#ff9800'
                    }}>
                      {q.difficulty}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                      Type: {q.question_type}
                    </span>
                  </div>

                  <h3 style={{ margin: '4px 0 10px 0', fontSize: 16, lineHeight: 1.5 }}>
                    {qIdx + 1}. {q.question_text}
                  </h3>

                  {q.code_snippet && (
                    <div style={{ background: '#1e1e1e', padding: 10, borderRadius: 6, fontFamily: 'monospace', fontSize: 12, color: '#81d4fa', marginBottom: 12, maxWidth: 650 }}>
                      <pre style={{ margin: 0 }}>{q.code_snippet}</pre>
                    </div>
                  )}

                  {/* Options List */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8, marginTop: 10 }}>
                    {q.options?.map((opt) => (
                      <div
                        key={opt.id}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          fontSize: 13,
                          background: opt.is_correct ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255,255,255,0.02)',
                          border: opt.is_correct ? '1px solid #00e676' : '1px solid var(--admin-border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}
                      >
                        <span style={{ fontSize: 13, color: opt.is_correct ? '#00e676' : 'var(--admin-text-muted)' }}>
                          {opt.is_correct ? '✓ [Correct]' : '○'}
                        </span>
                        <span>{opt.option_text}</span>
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 10 }}>
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="btn secondary"
                    style={{ fontSize: 12, color: '#ff5252', padding: '6px 12px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Question Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>Create Validated Question</h3>
            <form onSubmit={handleSaveQuestion}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Topic / Subject</label>
                  <input
                    type="text"
                    required
                    value={questionForm.topic}
                    onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                    placeholder="e.g., React Hooks, SQL Joins"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Difficulty</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'var(--admin-card-bg)', color: 'white', border: '1px solid var(--admin-border-subtle)' }}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Question Text</label>
                <textarea
                  required
                  rows={3}
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  placeholder="Enter the full question prompt..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Code Snippet (Optional)</label>
                <textarea
                  rows={2}
                  value={questionForm.code_snippet}
                  onChange={(e) => setQuestionForm({ ...questionForm, code_snippet: e.target.value })}
                  placeholder="e.g. const [val, setVal] = useState(0);"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white', fontFamily: 'monospace' }}
                />
              </div>

              {/* Options Section */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>
                  Option Choices (Click radio to set correct answer)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {questionForm.options.map((opt, oIdx) => (
                    <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="radio"
                        name="correct_option"
                        checked={opt.is_correct}
                        onChange={() => handleToggleCorrect(oIdx)}
                        style={{ cursor: 'pointer', width: 18, height: 18 }}
                      />
                      <input
                        type="text"
                        required
                        value={opt.option_text}
                        onChange={(e) => handleOptionTextChange(oIdx, e.target.value)}
                        placeholder={`Option ${oIdx + 1} choice...`}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Explanation / Feedback Note</label>
                <textarea
                  rows={2}
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  placeholder="Explain why this option is correct to aid student review..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn primary">
                  {saving ? 'Saving...' : 'Save to Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '90%', maxWidth: 600, padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>Bulk Import Questions</h3>
            <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 12 }}>
              Paste a JSON array of questions with options and is_correct flags.
            </p>
            <form onSubmit={handleBulkImport}>
              <textarea
                required
                rows={10}
                value={bulkPayload}
                onChange={(e) => setBulkPayload(e.target.value)}
                placeholder={`[\n  {\n    "topic": "JavaScript",\n    "difficulty": "EASY",\n    "question_type": "MCQ",\n    "question_text": "What does typeof null return?",\n    "options": [\n      { "option_text": "object", "is_correct": true },\n      { "option_text": "null", "is_correct": false }\n    ]\n  }\n]`}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white', fontFamily: 'monospace', fontSize: 12 }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setShowBulkModal(false)} className="btn secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn primary">
                  {saving ? 'Importing...' : 'Bulk Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
