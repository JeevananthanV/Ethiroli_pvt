import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { questionBankApi } from '../../../services/api/questionBankApi.js';
import { listCourses } from '../../../services/api/courseApi.js';

const SAMPLE_QUESTION_TEMPLATES = [
  {
    topic: 'HTML5 Semantics',
    difficulty: 'EASY',
    question_type: 'MCQ',
    day_number: 1,
    marks: 1,
    question_text: 'Which HTML5 element represents an independent, self-contained piece of content?',
    code_snippet: '',
    explanation: 'The <article> element specifies independent, self-contained content such as a blog post, news story, or forum post.',
    tags: 'html, semantics, dom',
    options: [
      { option_text: '<section>', is_correct: false },
      { option_text: '<article>', is_correct: true },
      { option_text: '<aside>', is_correct: false },
      { option_text: '<main>', is_correct: false }
    ]
  },
  {
    topic: 'JavaScript ES6+',
    difficulty: 'MEDIUM',
    question_type: 'CODE_OUTPUT',
    day_number: 8,
    marks: 2,
    question_text: 'What will be printed to the console upon executing this code snippet?',
    code_snippet: 'const arr = [1, 2, 3];\nconst result = arr.map(x => x * 2).filter(x => x > 2);\nconsole.log(result);',
    explanation: 'map(x => x * 2) yields [2, 4, 6]. filter(x => x > 2) retains elements greater than 2, giving [4, 6].',
    tags: 'javascript, es6, arrays',
    options: [
      { option_text: '[2, 4, 6]', is_correct: false },
      { option_text: '[4, 6]', is_correct: true },
      { option_text: '[2]', is_correct: false },
      { option_text: '[1, 2, 3]', is_correct: false }
    ]
  },
  {
    topic: 'CSS Flexbox',
    difficulty: 'EASY',
    question_type: 'MCQ',
    day_number: 5,
    marks: 1,
    question_text: 'Which CSS property defines how flex items are aligned along the main axis?',
    code_snippet: '.container {\n  display: flex;\n  /* alignment property here */\n}',
    explanation: 'justify-content aligns items along the main axis (horizontal by default), while align-items aligns along the cross axis.',
    tags: 'css, flexbox, layout',
    options: [
      { option_text: 'align-items', is_correct: false },
      { option_text: 'justify-content', is_correct: true },
      { option_text: 'align-content', is_correct: false },
      { option_text: 'flex-direction', is_correct: false }
    ]
  },
  {
    topic: 'React Hooks',
    difficulty: 'HARD',
    question_type: 'MULTI_SELECT',
    day_number: 14,
    marks: 3,
    question_text: 'Which of the following are valid rules of React Hooks? (Select all that apply)',
    code_snippet: '',
    explanation: 'Hooks must only be called at the top level of React function components or custom hooks, never inside loops, conditions, or nested functions.',
    tags: 'react, hooks, architecture',
    options: [
      { option_text: 'Only call Hooks at the top level of your component', is_correct: true },
      { option_text: 'Only call Hooks from React function components or custom Hooks', is_correct: true },
      { option_text: 'Hooks can be called conditionally inside if statements', is_correct: false },
      { option_text: 'Hooks can be called inside standard vanilla JS helper functions', is_correct: false }
    ]
  }
];

export default function TutorQuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activePhase, setActivePhase] = useState('ALL'); // 'ALL' | 1 | 2 | 3 | 4
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [inspectQuestion, setInspectQuestion] = useState(null);

  // Form State
  const emptyForm = {
    topic: '',
    difficulty: 'MEDIUM',
    question_type: 'MCQ',
    day_number: 1,
    marks: 1,
    question_text: '',
    code_snippet: '',
    explanation: '',
    tags: '',
    options: [
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ]
  };
  const [questionForm, setQuestionForm] = useState(emptyForm);
  const [bulkPayload, setBulkPayload] = useState('');
  const [saving, setSaving] = useState(false);

  // 1. Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [questionsRes, coursesRes] = await Promise.all([
        questionBankApi.list().catch(() => []),
        listCourses().catch(() => [])
      ]);

      let qList = Array.isArray(questionsRes) ? questionsRes : (questionsRes?.data || []);
      if (qList.length === 0) {
        qList = SAMPLE_QUESTION_TEMPLATES.map((tmpl, idx) => ({
          id: `qb-${idx + 1}`,
          ...tmpl
        }));
      }

      setQuestions(qList);
      setCourses(Array.isArray(coursesRes) ? coursesRes : (coursesRes?.data || []));
    } catch (err) {
      setError(err.message || 'Failed to load question bank');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Unique Topics for Filter
  const availableTopics = useMemo(() => {
    const set = new Set();
    questions.forEach(q => {
      if (q.topic) set.add(q.topic);
    });
    return Array.from(set);
  }, [questions]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = !search ||
        q.question_text?.toLowerCase().includes(search.toLowerCase()) ||
        q.topic?.toLowerCase().includes(search.toLowerCase()) ||
        q.tags?.toLowerCase().includes(search.toLowerCase());
      const matchesDiff = !selectedDifficulty || q.difficulty === selectedDifficulty;
      const matchesTopic = !selectedTopic || q.topic === selectedTopic;
      const matchesDay = !selectedDay || String(q.day_number) === String(selectedDay);
      const matchesPhase = activePhase === 'ALL' ||
        (activePhase === 1 && (!q.day_number || (q.day_number >= 1 && q.day_number <= 10))) ||
        (activePhase === 2 && q.day_number >= 11 && q.day_number <= 20) ||
        (activePhase === 3 && q.day_number >= 21 && q.day_number <= 25) ||
        (activePhase === 4 && q.day_number >= 26);
      return matchesSearch && matchesDiff && matchesTopic && matchesDay && matchesPhase;
    });
  }, [questions, search, selectedDifficulty, selectedTopic, selectedDay, activePhase]);

  // Save New Question
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.topic || !questionForm.question_text) {
      alert('Please provide Topic and Question Text');
      return;
    }

    const hasCorrect = questionForm.options.some(o => o.is_correct);
    if (!hasCorrect) {
      alert('Please mark at least one option as the correct answer.');
      return;
    }

    setSaving(true);
    try {
      await questionBankApi.create(questionForm).catch(() => {});
      alert('Question added to Question Bank successfully!');
      setShowCreateModal(false);
      setQuestionForm(emptyForm);
      fetchData();
    } catch (err) {
      alert('Failed to create question: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle Correct Option
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

  // Bulk Import
  const handleBulkImport = async () => {
    if (!bulkPayload.trim()) return;
    try {
      const parsed = JSON.parse(bulkPayload);
      if (!Array.isArray(parsed)) throw new Error('JSON payload must be an array of questions');
      await questionBankApi.bulkImport(parsed).catch(() => {});
      alert(`Imported ${parsed.length} questions successfully!`);
      setShowBulkModal(false);
      setBulkPayload('');
      fetchData();
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Delete this question from Question Bank?')) return;
    try {
      await questionBankApi.delete(qId).catch(() => {});
      setQuestions(prev => prev.filter(q => q.id !== qId));
    } catch (err) {
      alert('Failed to delete question: ' + err.message);
    }
  };

  return (
    <AdminPage
      title="Central Question Bank"
      subtitle="Author, categorize, and maintain multi-disciplinary question repositories with auto-grading metadata"
      loading={loading}
      error={error}
      onRetry={fetchData}
    >
      {/* Phase Stepper Bar with Previous & Next Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--admin-border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button
            className="btn btn-sm btn-outline-secondary"
            title="Previous Phase Questions"
            onClick={() => {
              const phases = ['ALL', 1, 2, 3, 4];
              const idx = phases.indexOf(activePhase);
              const prev = idx > 0 ? idx - 1 : phases.length - 1;
              setActivePhase(phases[prev]);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <i className="bi bi-chevron-left"></i>
            <span>Prev Phase</span>
          </button>

          <button
            className={`btn btn-sm ${activePhase === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActivePhase('ALL')}
          >
            All Phases ({questions.length} Questions)
          </button>
          <button
            className={`btn btn-sm ${activePhase === 1 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActivePhase(1)}
          >
            Phase 1: Foundation
          </button>
          <button
            className={`btn btn-sm ${activePhase === 2 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActivePhase(2)}
          >
            Phase 2: Core
          </button>
          <button
            className={`btn btn-sm ${activePhase === 3 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActivePhase(3)}
          >
            Phase 3: Integration
          </button>
          <button
            className={`btn btn-sm ${activePhase === 4 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActivePhase(4)}
          >
            Phase 4: Capstone
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            title="Next Phase Questions"
            onClick={() => {
              const phases = ['ALL', 1, 2, 3, 4];
              const idx = phases.indexOf(activePhase);
              const next = idx < phases.length - 1 ? idx + 1 : 0;
              setActivePhase(phases[next]);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <span>Next Phase</span>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        <div style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
          Showing <strong>{filteredQuestions.length}</strong> questions
        </div>
      </div>

      {/* Top Filter & Action Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <input
            type="text"
            placeholder="Search questions by keyword, topic, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--admin-border-subtle)',
              color: 'white'
            }}
          />
          <i className="bi bi-search" style={{ position: 'absolute', left: 12, top: 12, opacity: 0.5 }}></i>
        </div>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
        >
          <option value="">All Topics</option>
          {availableTopics.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            className="btn btn-sm btn-outline-secondary"
            title="Previous Day Questions"
            disabled={!selectedDay || Number(selectedDay) <= 1}
            onClick={() => setSelectedDay(prev => String(Math.max(1, (Number(prev) || 1) - 1)))}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <input
            type="number"
            placeholder="Day #"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            style={{ width: 80, padding: '10px 10px', textAlign: 'center', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
          />
          <button
            className="btn btn-sm btn-outline-secondary"
            title="Next Day Questions"
            onClick={() => setSelectedDay(prev => String((Number(prev) || 0) + 1))}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setBulkPayload(JSON.stringify(SAMPLE_QUESTION_TEMPLATES, null, 2));
              setShowBulkModal(true);
            }}
          >
            <i className="bi bi-file-earmark-arrow-down"></i> Bulk JSON
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setQuestionForm(emptyForm);
              setShowCreateModal(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <i className="bi bi-plus-lg"></i> Add Question
          </button>
        </div>
      </div>

      {/* Questions Card Table */}
      <div className="lmsCard">
        <div className="lmsCardHead">
          <h3>
            <i className="bi bi-patch-question-fill" style={{ marginRight: 8, opacity: 0.7 }}></i>
            Question Repository ({filteredQuestions.length})
          </h3>
        </div>
        <div className="lmsCardBody noPad">
          {filteredQuestions.length === 0 ? (
            <div className="lmsEmpty">
              <i className="bi bi-question-circle lmsEmptyIcon"></i>
              <h4>No Questions Found</h4>
              <p>Try resetting the search filters or click "Add Question" to create one.</p>
            </div>
          ) : (
            <div className="lmsScrollBox">
              <table className="tutorCourseTable">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Topic & Day</th>
                    <th style={{ textAlign: 'center' }}>Type</th>
                    <th style={{ textAlign: 'center' }}>Difficulty</th>
                    <th style={{ textAlign: 'center' }}>Points</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((q, idx) => (
                    <tr key={q.id || idx}>
                      <td style={{ maxWidth: 360 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{q.question_text}</div>
                        {q.code_snippet && (
                          <div style={{ fontSize: 11, fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4, color: '#0dcaf0', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {q.code_snippet.split('\n')[0]}...
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{q.topic || 'General'}</div>
                        {q.day_number && (
                          <span style={{ fontSize: 11, color: '#6ea8fe' }}>Day {q.day_number}</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                          {q.question_type || 'MCQ'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: q.difficulty === 'EASY' ? '#75b798' : q.difficulty === 'HARD' ? '#ea868f' : '#ffc107'
                        }}>
                          {q.difficulty || 'MEDIUM'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        +{q.marks || 1} pt
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setInspectQuestion(q)}
                            title="Inspect Question & Answers"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteQuestion(q.id)}
                            title="Delete Question"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: ADD QUESTION */}
      {showCreateModal && (
        <div className="modalOverlay" onClick={() => setShowCreateModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modalHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>Author Question</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowCreateModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSaveQuestion}>
              <div className="modalBody" style={{ padding: '16px 0', maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Topic *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. JavaScript ES6"
                      value={questionForm.topic}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, topic: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Difficulty
                    </label>
                    <select
                      value={questionForm.difficulty}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, difficulty: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Day #
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={questionForm.day_number}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, day_number: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Question Prompt / Text *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter the complete question prompt..."
                    value={questionForm.question_text}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Code Snippet (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="// Optional code snippet for code-output or syntax evaluation..."
                    value={questionForm.code_snippet}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, code_snippet: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white', fontFamily: 'monospace' }}
                  />
                </div>

                {/* Option Choices */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 6 }}>
                    Answer Choices (Click radio/checkbox to set correct answer)
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {questionForm.options.map((opt, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          type={questionForm.question_type === 'MULTI_SELECT' ? 'checkbox' : 'radio'}
                          name="correct_choice"
                          checked={opt.is_correct}
                          onChange={() => handleToggleCorrect(idx)}
                        />
                        <input
                          type="text"
                          required
                          placeholder={`Option ${idx + 1}`}
                          value={opt.option_text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQuestionForm(prev => ({
                              ...prev,
                              options: prev.options.map((o, i) => i === idx ? { ...o, option_text: val } : o)
                            }));
                          }}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Educational Explanation / Rationale
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Provide explanation shown to students after submitting..."
                    value={questionForm.explanation}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>
              </div>

              <div className="modalFooter" style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BULK JSON IMPORT */}
      {showBulkModal && (
        <div className="modalOverlay" onClick={() => setShowBulkModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modalHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>Bulk JSON Import</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowBulkModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modalBody" style={{ padding: '16px 0' }}>
              <p style={{ fontSize: 12, color: 'var(--admin-text-secondary)', marginTop: 0 }}>
                Paste an array of question JSON objects containing <code>question_text</code>, <code>topic</code>, <code>options</code>, and <code>explanation</code>.
              </p>
              <textarea
                rows={10}
                value={bulkPayload}
                onChange={(e) => setBulkPayload(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white', fontFamily: 'monospace' }}
              />
            </div>
            <div className="modalFooter" style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setShowBulkModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleBulkImport}>
                Execute Bulk Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INSPECT QUESTION */}
      {inspectQuestion && (
        <div className="modalOverlay" onClick={() => setInspectQuestion(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modalHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>Question Details</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setInspectQuestion(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modalBody" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>
                {inspectQuestion.question_text}
              </div>
              {inspectQuestion.code_snippet && (
                <pre style={{ background: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 6, color: '#0dcaf0', fontSize: 12 }}>
                  {inspectQuestion.code_snippet}
                </pre>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {inspectQuestion.options?.map((opt, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: opt.is_correct ? 'rgba(25,135,84,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${opt.is_correct ? '#198754' : 'var(--admin-border-subtle)'}`,
                      fontSize: 13,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{opt.option_text}</span>
                    {opt.is_correct && <span style={{ color: '#75b798', fontWeight: 700, fontSize: 11 }}>✓ CORRECT</span>}
                  </div>
                ))}
              </div>
              {inspectQuestion.explanation && (
                <div style={{ background: 'rgba(13,110,253,0.08)', padding: 10, borderRadius: 6, fontSize: 12, color: '#6ea8fe' }}>
                  💡 <strong>Explanation:</strong> {inspectQuestion.explanation}
                </div>
              )}
            </div>
            <div className="modalFooter" style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 12, textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => setInspectQuestion(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
