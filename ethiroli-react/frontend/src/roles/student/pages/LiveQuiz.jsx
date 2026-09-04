import React, { useState, useEffect } from 'react';

export default function StudentLiveQuiz() {
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t > 0 ? t - 1 : 60);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="cardHeader">
        <h2 className="cardTitle">Live Coding Quiz</h2>
        <span className="statusTag error">Timer: {timer}s</span>
      </div>
      <div className="cardBody">
        <h3>What is the correct hook for updating store values in Redux Toolkit?</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {['useSelector', 'useDispatch', 'useReducer', 'useStore'].map((opt, i) => (
            <button key={opt} onClick={() => setSelected(i)} className="card" style={{ padding: '12px', background: selected === i ? 'var(--admin-secondary)' : 'rgba(255,255,255,0.03)', border: selected === i ? '1px solid var(--admin-primary)' : '1px solid var(--admin-border-subtle)', textAlign: 'left', cursor: 'pointer' }}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}