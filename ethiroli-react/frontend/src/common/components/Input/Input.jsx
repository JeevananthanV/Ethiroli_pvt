import React from 'react';

export default function Input({ label, type = 'text', value, onChange, placeholder, name, required = false, className = '' }) {
  return (
    <div className={`inputGroup ${className}`}>
      {label && <label className="label">{label} {required && <span className="required">*</span>}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        required={required}
        className="inputField"
      />
    </div>
  );
}