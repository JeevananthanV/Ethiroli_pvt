import React, { useId, useState } from 'react';

// `type` is pulled out of the rest-spread deliberately: leaving it in `props`
// means the trailing `{...props}` re-applies the caller's original
// type="password" on every render and silently undoes the reveal toggle.
const Input = ({ label, required, error, type = 'text', ...props }) => {
  const generatedId = useId();
  const inputId = props.id || props.name || generatedId;
  const isPasswordField = type === 'password';
  const [revealed, setRevealed] = useState(false);

  const input = (
    <input
      className={`inputField ${error ? 'error' : ''}`}
      id={inputId}
      name={props.name || inputId}
      type={isPasswordField ? (revealed ? 'text' : 'password') : type}
      {...props}
    />
  );

  return (
    <div className="formGroup">
      {label && (
        <label className="label" htmlFor={inputId}>
          {label}
          {required && <span className="required"> *</span>}
        </label>
      )}
      {isPasswordField ? (
        <div className="passwordField">
          {input}
          <button
            type="button"
            className="passwordToggle"
            onClick={() => setRevealed((prev) => !prev)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            title={revealed ? 'Hide password' : 'Show password'}
          >
            <i className={`bi ${revealed ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
          </button>
        </div>
      ) : (
        input
      )}
      {error && <span className="textDanger" style={{ fontSize: '12px', marginTop: '4px' }}>{error}</span>}
    </div>
  );
};

export default Input;
