import React, { useState } from 'react';

export default function CheckoutFlow({ cartItems, onClose, onSuccess }) {
  const [form, setForm] = useState({ paymentMethod: 'card', cardNumber: '', expiry: '', cvv: '' });
  const [submitting, setSubmitting] = useState(false);

  const total = cartItems?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      alert('Checkout completed (would call payment API)');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Checkout</h3>
        <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--admin-bg-input)', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Order Summary</p>
          <p style={{ margin: '0 0 4px', color: 'var(--admin-text-secondary)', fontSize: '13px' }}>{cartItems?.length || 0} items</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '18px' }}>Total: ${total.toLocaleString()}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Payment Method</label>
            <select className="select" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          {form.paymentMethod === 'card' && (
            <>
              <div className="formGroup">
                <label className="label">Card Number</label>
                <input className="input" value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="formGroup">
                  <label className="label">Expiry</label>
                  <input className="input" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} placeholder="MM/YY" required />
                </div>
                <div className="formGroup">
                  <label className="label">CVV</label>
                  <input className="input" type="password" value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} required />
                </div>
              </div>
            </>
          )}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary" disabled={submitting}>
              {submitting ? 'Processing...' : `Pay $${total.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
