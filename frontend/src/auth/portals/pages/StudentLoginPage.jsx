import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import { getRoleDefaultPath } from '../../../common/utils/roleRouting.js';
import { getDemoUsers } from '../../../services/api/authApi.js';
import styles from '../../pages/Auth.module.css';

/**
 * Dedicated, Dynamic Student Login Component for Ethiroli LMS
 * - 100% Dynamic: Queries live student accounts, enrollments, and progress from MySQL
 * - Zero static data: No hardcoded student arrays
 * - Role-guarded: Authenticates through student portal boundary
 */
export default function StudentLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamic live student profiles loaded straight from database
  const [liveStudents, setLiveStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoadingStudents(true);
        const data = await getDemoUsers('STUDENT');
        if (isMounted) {
          setLiveStudents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load dynamic student profiles:', err);
      } finally {
        if (isMounted) setLoadingStudents(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleSelectStudent = (studentEmail) => {
    setEmail(studentEmail);
    setPassword('Student@123');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password, 'student');
      const loggedUser = response?.user || response?.data?.user;
      
      // Dynamic route resolution
      const targetPath = location.state?.from?.pathname || getRoleDefaultPath(loggedUser?.role || 'STUDENT');
      navigate(targetPath, { replace: true });
    } catch (err) {
      console.error('Student login error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Student authentication failed. Please verify your student email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer} style={{ background: 'radial-gradient(circle at 50% 15%, rgba(59, 130, 246, 0.2) 0%, rgba(15, 23, 42, 0.95) 60%, #090d16 100%)' }}>
      <div className={styles.authCard} style={{ maxWidth: '460px', borderColor: 'rgba(59, 130, 246, 0.25)', boxShadow: '0 25px 65px rgba(0, 0, 0, 0.7), 0 0 35px rgba(59, 130, 246, 0.15)' }}>
        
        {/* Header */}
        <div className={styles.header}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: '14px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8', display: 'inline-block', boxShadow: '0 0 8px #38bdf8' }}></span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Student Learning Portal
            </span>
          </div>

          <h2 style={{ background: 'linear-gradient(135deg, #60a5fa, #38bdf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '1px' }}>
            ETHIROLI LMS
          </h2>
          <p style={{ color: 'rgba(241, 245, 249, 0.85)', fontSize: '0.88rem' }}>
            Sign in to access your assigned courses, live sessions, quizzes, and certificates.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className={styles.error} style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.35)', color: '#fca5a5' }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="mb-3 text-start">
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
              Student Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student.name@ethiroli.edu"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          </div>

          <div className="mb-3 text-start">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', margin: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#3b82f6' }}
              />
              Remember my session
            </label>
            <span style={{ fontSize: '0.8rem', color: '#60a5fa', cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              transition: 'transform 0.15s ease, background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating Learner...</span>
              </>
            ) : (
              <>
                <span>Sign In to Learning Portal</span>
                <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>
        </form>

        {/* 100% Dynamic Database-Driven Student Profile Switcher */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bi bi-people-fill text-info" style={{ fontSize: '0.85rem' }}></i>
              <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', fontWeight: 600 }}>
                Live Students in Database
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
              Live MySQL Data
            </span>
          </div>

          {loadingStudents ? (
            <div style={{ padding: '10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Loading active student profiles...
            </div>
          ) : liveStudents.length > 0 ? (
            <div>
              <select
                aria-label="Select dynamic student to auto-fill"
                value={email || ''}
                onChange={(e) => e.target.value && handleSelectStudent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#f8fafc',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="" style={{ color: '#000' }}>
                  -- Select Live Student ({liveStudents.length} loaded from DB) --
                </option>
                {liveStudents.map((s) => (
                  <option key={s.id || s.email} value={s.email} style={{ color: '#000' }}>
                    {s.full_name} &bull; {s.email} {s.top_course ? `(${s.top_progress}% in ${s.top_course})` : ''}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>Default Password: <code style={{ color: '#38bdf8', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '3px' }}>Student@123</code></span>
                <span>Select to auto-fill</span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              No active student accounts found in database.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
