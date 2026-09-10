import React from 'react';

const Input = ({ label, required, error, ...props }) => {
  return (
    <div className="formGroup">
      {label && (
        <label className="label">
          {label}
          {required && <span className="required"> *</span>}
        </label>
      )}
      <input className={`inputField ${error ? 'error' : ''}`} {...props} />
      {error && <span className="textDanger" style={{ fontSize: '12px', marginTop: '4px' }}>{error}</span>}
    </div>
  );
};

export default Input;
