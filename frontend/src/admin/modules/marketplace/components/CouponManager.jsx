import React, { useEffect, useState } from 'react';
import { getCoupons, createCoupon } from '../../../../services/api/couponApi.js';

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discount: '', type: 'percentage' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getCoupons().catch(() => []);
        setCoupons(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load coupons:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCoupon({ ...form, discount: Number(form.discount) });
      setShowForm(false);
      setForm({ code: '', discount: '', type: 'percentage' });
    } catch (err) {
      console.error('Failed to create coupon:', err);
    }
  };

  if (loading) return <div className="loading">Loading coupons...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Coupon Manager</h2>
          <p className="pageSubtitle">Manage discount coupons</p>
        </div>
        <div className="pageActions">
          <button onClick={() => setShowForm(true)} className="btn btnPrimary">+ Create Coupon</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {coupons.length === 0 ? (
            <div className="emptyState"><h3>No Coupons</h3><p>Create your first coupon.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Code</th><th>Type</th><th>Discount</th></tr></thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td><code>{coupon.code}</code></td>
                    <td>{coupon.type}</td>
                    <td>{coupon.discount}{coupon.type === 'percentage' ? '%' : '$'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showForm && (
        <div className="modalOverlay" onClick={() => setShowForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Create Coupon</h3>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label className="label">Coupon Code</label>
                <input className="input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Discount Value</label>
                <input className="input" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Type</label>
                <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
