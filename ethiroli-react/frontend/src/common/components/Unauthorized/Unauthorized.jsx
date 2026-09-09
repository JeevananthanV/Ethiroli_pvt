import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getRoleDefaultPath } from '../../utils/roleRouting.js';
import Button from '../Button/Button.jsx';

export default function Unauthorized({ requiredRoles = [] }) {
  const { user } = useAuth();
  const homePath = getRoleDefaultPath(user?.role);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem',
      background: 'var(--color-bg-main, #F1ECE6)',
      color: 'var(--color-text-main, #2D2D2D)'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        boxShadow: '0 16px 40px rgba(26, 75, 72, 0.1)',
        maxWidth: '520px',
        border: '1px solid rgba(26, 75, 72, 0.12)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(175, 67, 30, 0.12)',
          color: 'var(--color-secondary, #AF431E)',
          display: 'grid',
          placeItems: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          !
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-accent, #1A4B48)',
          marginBottom: '0.75rem',
          fontSize: '1.75rem'
        }}>
          Access Restricted
        </h2>

        <p style={{
          color: 'var(--color-text-muted, #555555)',
          marginBottom: '1.25rem',
          fontSize: '0.95rem',
          lineHeight: '1.6'
        }}>
          Your current account role (<strong>{user?.role || 'Guest'}</strong>) does not have authorization to view this module.
        </p>

        {requiredRoles.length > 0 && (
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted, #777777)',
            marginBottom: '1.75rem'
          }}>
            Required Role(s): {requiredRoles.join(', ')}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to={homePath} style={{ textDecoration: 'none' }}>
            <Button variant="primary">
              Return to My Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
