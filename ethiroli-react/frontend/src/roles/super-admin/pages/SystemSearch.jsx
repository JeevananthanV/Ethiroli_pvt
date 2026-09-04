import React, { useEffect, useState, useMemo } from 'react';
import { globalSearch } from '../../../services/api/searchApi.js';

export default function SystemSearch() {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = term.trim();
      if (query.length <= 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await globalSearch(query);
        setResults(data?.data || data || []);
      } catch (err) {
        console.error('Search failed', err);
        setError('Search failed. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [term]);

  const grouped = useMemo(() => {
    const map = {};
    (results || []).forEach(r => {
      const key = r.type || r.category || 'OTHER';
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, [results]);

  if (error) return <div className="emptyState">{error}</div>;

  return (
    <div className="card" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div className="cardHeader">
        <h2 className="cardTitle">Deep System Lookup Search</h2>
      </div>
      <div className="cardBody">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="input"
          placeholder="Lookup users, leads, courses, or system keys..."
          style={{ fontSize: '16px', padding: '14px' }}
        />
        {loading && <div className="loading" style={{ marginTop: '16px' }}>Searching...</div>}
        {!loading && Object.keys(grouped).length === 0 && term.length > 2 && (
          <div className="emptyState" style={{ marginTop: '16px' }}>No results found.</div>
        )}
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} style={{ marginTop: '20px' }}>
            <h4 className="roleTag" style={{ marginBottom: '8px' }}>{type}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((r, i) => (
                <div key={i} className="card" style={{ padding: '12px', background: 'var(--admin-bg-card-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: 'white' }}>{r.label || r.name || r.title || '-'}</span>
                    {r.description && <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>{r.description}</div>}
                  </div>
                  {r.path && <a href={r.path} className="btn btnSecondary" style={{ fontSize: '12px' }}>Go</a>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
