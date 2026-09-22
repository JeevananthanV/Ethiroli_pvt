import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../../../services/api/transactionApi.js';

export default function FinanceDashboardWidgets() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getTransactions().catch(() => []);
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading finance data...</div>;

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="statCard">
          <p className="statLabel">Total Income</p>
          <p className="statValue" style={{ color: 'var(--admin-success)' }}>${totalIncome.toLocaleString()}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Total Expenses</p>
          <p className="statValue" style={{ color: 'var(--admin-danger)' }}>${totalExpense.toLocaleString()}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Net Profit</p>
          <p className="statValue" style={{ color: totalIncome - totalExpense >= 0 ? 'var(--admin-success)' : 'var(--admin-danger)' }}>
            ${(totalIncome - totalExpense).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
