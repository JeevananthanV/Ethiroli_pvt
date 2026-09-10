import React from 'react';

export default function CartDrawer({ cartItems, onClose }) {
  const total = cartItems?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '400px', maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Shopping Cart ({cartItems?.length || 0})</h3>
          <button onClick={onClose} className="btn" style={{ padding: '4px 8px' }}>Close</button>
        </div>
        {cartItems?.length === 0 ? (
          <div className="emptyState"><h3>Cart Empty</h3><p>Add items to your cart.</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ padding: '12px', border: '1px solid var(--admin-border-subtle)', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 4px' }}>{item.title || item.name}</h4>
                <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '13px' }}>${(item.price || 0).toLocaleString()}</p>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--admin-border-default)', paddingTop: '16px', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px' }}>
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
