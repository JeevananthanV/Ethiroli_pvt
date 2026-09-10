import React, { useEffect, useState } from 'react';
import { getHolidays } from '../../../../services/api/holidayApi.js';

export default function HolidayList() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getHolidays().catch(() => []);
        setHolidays(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load holidays:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading holidays...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Official Holidays</h2>
          <p className="pageSubtitle">Organization holiday calendar</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {holidays.length === 0 ? (
            <div className="emptyState"><h3>No Holidays</h3><p>No holidays configured.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Date</th><th>Type</th></tr></thead>
              <tbody>
                {holidays.map((hol) => (
                  <tr key={hol.id}>
                    <td>{hol.name}</td>
                    <td>{hol.date ? new Date(hol.date).toLocaleDateString() : '—'}</td>
                    <td>{hol.type || 'Public'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
