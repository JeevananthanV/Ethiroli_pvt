import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourse } from '../../../services/api/courseApi.js';
import { getCoupons } from '../../../services/api/couponApi.js';

export default function CheckoutPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    billingAddress: '',
    paymentMethod: 'card',
  });

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCourse(id);
        setCourse(data);
      } catch (err) {
        setError(err.message || 'Failed to load checkout details');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadCourse();
  }, [id]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Enter a coupon code');
      return;
    }
    setCouponLoading(true);
    setCouponError(null);
    setCoupon(null);
    try {
      const data = await getCoupons();
      const found = (Array.isArray(data) ? data : []).find(
        (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
      );
      if (!found) {
        setCouponError('Invalid or expired coupon code');
      } else if (found.is_active === false) {
        setCouponError('This coupon has been deactivated');
      } else {
        setCoupon(found);
      }
    } catch (err) {
      setCouponError('Could not validate coupon. Try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const price = course?.price ? Number(course.price) : 0;
  const gstRate = 0.18;
  const subtotal = price;
  const discountAmount = coupon ? (coupon.discount_percent ? subtotal * (coupon.discount_percent / 100) : subtotal) : 0;
  const taxable = Math.max(subtotal - discountAmount, 0);
  const gst = taxable * gstRate;
  const total = taxable + gst;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { createCheckoutSession } = await import('../../../services/api/marketplaceApi.js');
      const session = await createCheckoutSession({
        courseId: id,
        couponCode: coupon?.code || null,
        buyer: { ...form },
        totals: { subtotal, discountAmount, gst, total },
      });
      if (session?.paymentUrl) {
        window.location.href = session.paymentUrl;
      } else {
        alert('Order placed successfully! Confirmation sent to your email.');
      }
    } catch {
      alert('Checkout failed: ' + (err.message || 'Please try again'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--admin-bg-dark)' }}>
        <div className="loading">Loading checkout details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--admin-bg-dark)', padding: '40px 20px' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--admin-danger)', fontSize: '20px' }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: 'var(--admin-text-primary)', fontWeight: '500' }}>Checkout unavailable</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--admin-text-muted)' }}>{error}</p>
            </div>
            <Link to="/marketplace/catalog" className="btn secondary btnSm">Back to Catalog</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--admin-bg-dark)', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 className="cardTitle" style={{ marginBottom: '16px' }}>Checkout</h2>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '28px',
                }}
              >
                {course.icon || '📚'}
              </div>
              <div>
                <h4 style={{ margin: 0 }}>{course.title}</h4>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
                  {course.level || 'All Levels'} • {course.is_active ? 'Published' : 'Draft'}
                </p>
              </div>
            </div>

            <form className="form" onSubmit={handleSubmit}>
              <div className="formGroup">
                <label className="label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="inputField"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label className="label">Billing Email <span className="required">*</span></label>
                <input
                  type="email"
                  required
                  className="inputField"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label className="label">Phone Number</label>
                <input
                  type="tel"
                  className="inputField"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label className="label">Billing Address</label>
                <textarea
                  className="textarea"
                  placeholder="Your billing address"
                  value={form.billingAddress}
                  onChange={(e) => setForm({ ...form, billingAddress: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label className="label">Payment Method</label>
                <select
                  className="select"
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                >
                  <option value="card">Credit / Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="wallet">Digital Wallet</option>
                </select>
              </div>
              <button type="submit" className="btn primary btnFull" disabled={submitting}>
                {submitting ? 'Processing Payment...' : `Pay ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: '28px' }}>
            <h3 className="cardTitle" style={{ marginBottom: '16px' }}>Order Summary</h3>
            <table className="table" style={{ marginBottom: '16px' }}>
              <tbody>
                <tr>
                  <td style={{ color: 'var(--admin-text-secondary)' }}>Course Price</td>
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>₹{subtotal.toLocaleString('en-IN')}</td>
                </tr>
                {discountAmount > 0 && (
                  <tr>
                    <td style={{ color: 'var(--admin-success)' }}>Coupon Discount</td>
                    <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--admin-success)' }}>
                      -₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ color: 'var(--admin-text-secondary)' }}>GST (18%)</td>
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                  <td>Order Total</td>
                  <td style={{ textAlign: 'right' }}>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
              </tbody>
            </table>

            <div className="formGroup" style={{ marginBottom: '12px' }}>
              <label className="label">Apply Coupon</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="inputField"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn secondary btnSm"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
              {couponError && <p style={{ color: 'var(--admin-danger)', fontSize: '12px', margin: '6px 0 0' }}>{couponError}</p>}
              {coupon && (
                <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <span className="statusTag active" style={{ marginRight: '6px' }}>{coupon.code}</span>
                  <span style={{ color: 'var(--admin-success)', fontSize: '12px', fontWeight: '600' }}>
                    {coupon.discount_percent ? `${coupon.discount_percent}% off` : 'Discount applied'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
