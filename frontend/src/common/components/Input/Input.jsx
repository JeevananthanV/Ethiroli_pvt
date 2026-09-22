import React, { useId } from 'react';

const Input = ({ label, required, error, ...props }) => {
  const generatedId = useId();
  const inputId = props.id || props.name || generatedId;

  return (
    <div className="formGroup">
      {label && (
        <label className="label" htmlFor={inputId}>
          {label}
          {required && <span className="required"> *</span>}
        </label>
      )}
      <input
        className={`inputField ${error ? 'error' : ''}`}
        id={inputId}
        name={props.name || inputId}
        {...props}
      />
      {error && <span className="textDanger" style={{ fontSize: '12px', marginTop: '4px' }}>{error}</span>}
    </div>
  );
};

export default Input;
