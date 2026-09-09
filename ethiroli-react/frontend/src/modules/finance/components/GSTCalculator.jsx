import React, { useState, useMemo } from 'react';
import { logIncome, logExpense, getTransactions } from '../services/api/transactionApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function GSTCalculator() {
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState('exclusive');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const cgst = useMemo(() => {
    const base = Number(amount) || 0;
    if (mode === 'exclusive') {
      return (base * gstRate) / 200;
    }
    return (base * gstRate) / (100 + gstRate) / 2;
  }, [amount, gstRate, mode]);

  const sgst = cgst;
  const totalGst = cgst + sgst;
  const totalAmount = mode === 'exclusive' ? Number(amount) + totalGst : Number(amount);

  const handleSaveExpense = async () => {
    setLoading(true);
    try {
      await logExpense({
        description: 'GST calculation',
        amount: totalAmount,
        category: 'other',
        date: new Date().toISOString().split('T')[0],
        reference: `GST-${gstRate}%`,
      });
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
      alert('Saved successfully');
    } catch (err) {
      alert(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIncome = async () => {
    setLoading(true);
    try {
      await logIncome({
        description: 'GST calculation',
        amount: totalAmount,
        category: 'other',
        date: new Date().toISOString().split('T')[0],
        reference: `GST-${gstRate}%`,
      });
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
      alert('Saved successfully');
    } catch (err) {
      alert(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPage
      title="GST Calculator"
      subtitle="Calculate GST inclusive and exclusive amounts"
      loading={false}
      error={null}
      onRetry={() => {}}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Calculator</h3></div>
          <div className="cardBody">
            <div className="formGroup">
              <label className="label">Mode</label>
              <select className="select" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="exclusive">GST Exclusive (add GST to base)</option>
                <option value="inclusive">GST Inclusive (extract GST from total)</option>
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Base Amount (₹) <span className="required">*</span></label>
              <input className="inputField" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" />
            </div>
            <div className="formGroup">
              <label className="label">GST Rate (%)</label>
              <select className="select" value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))}>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
            <div style={{ display: 'grid', gap: 8, marginTop: 16, padding: 16, background: 'var(--admin-bg-card)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-text-secondary)' }}>CGST</span>
                <span style={{ fontWeight: 500 }}>{cgst.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-text-secondary)' }}>SGST</span>
                <span style={{ fontWeight: 500 }}>{sgst.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 8 }}>
                <span style={{ color: 'var(--admin-text-secondary)' }}>Total GST</span>
                <span style={{ fontWeight: 600 }}>{totalGst.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-text-secondary)' }}>{mode === 'exclusive' ? 'Total Amount' : 'Base Amount'}</span>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn primary" onClick={handleSaveExpense} disabled={loading || !amount}>Save as Expense</button>
              <button className="btn secondary" onClick={handleSaveIncome} disabled={loading || !amount}>Save as Income</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Recent GST Transactions</h3></div>
          <div className="cardBody">
            {transactions.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No transactions yet.</p>
            ) : (
              <div className="overflowAuto">
                <table className="table">
                  <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Category</th></tr></thead>
                  <tbody>
                    {transactions.slice(0, 10).map((t) => (
                      <tr key={t.id}>
                        <td className="textSecondary">{t.date || '-'}</td>
                        <td className="textSecondary">{t.description || '-'}</td>
                        <td className="textSecondary">₹{Number(t.amount).toFixed(2)}</td>
                        <td><span className="statusTag active">{t.category || 'other'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
