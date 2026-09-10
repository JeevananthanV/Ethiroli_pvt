import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function StudentLiveQuiz() {
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const options = ['useSelector', 'useDispatch', 'useReducer', 'useStore'];

  return (
    <AdminPage
      title="Live Coding Quiz"
      subtitle="Test your knowledge with timed challenges"
    >
      <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Live Coding Quiz</h3>
          <span className={`statusTag ${timer <= 10 ? 'error' : 'pending'}`}>Timer: {timer}s</span>
        </div>
        <div className="cardBody">
          <h3 style={{ marginTop: 0 }}>What is the correct hook for updating store values in Redux Toolkit?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {options.map((opt, i) => (
              <button
                key={opt}
                onClick={() => setSelected(i)}
                className="btn"
                style={{
                  padding: 12,
                  background: selected === i ? 'var(--admin-secondary)' : 'rgba(255,255,255,0.03)',
                  border: selected === i ? '1px solid var(--admin-primary)' : '1px solid var(--admin-border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 10,
                  color: 'white',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}