import React, { useState, useEffect } from 'react';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

export default function MfaChallenge({ email, onSubmit, onBack, error }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);
    try {
      await onSubmit(code);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'MFA verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--admin-bg)' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--admin-card)', borderRadius: 16, padding: 32, boxShadow: '0 10px 40px rgba(0,0,0,0.35)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, letterSpacing: 1 }}>ETHIROLI</h2>
          <p style={{ margin: 0, color: 'var(--admin-text-secondary)' }}>Two-Factor Authentication</p>
          {email && <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--admin-text-muted)' }}>Verifying identity for {email}</p>}
        </div>

        {(localError || error) && <div style={{ padding: 10, borderRadius: 8, marginBottom: 16, background: 'rgba(244,63,94,0.1)', color: 'var(--admin-danger)', fontSize: 13 }}>{localError || error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Authentication Code" type="text" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6} placeholder="000000" />
          <Button type="submit" variant="primary" disabled={loading || code.length !== 6} style={{ width: '100%' }}>{loading ? 'Verifying...' : 'Verify'}</Button>
          <Button type="button" variant="secondary" onClick={onBack} style={{ width: '100%' }}>Back to login</Button>
        </form>
      </div>
    </div>
  );
}
