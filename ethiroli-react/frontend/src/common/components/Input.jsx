import React from 'react'

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  ...props
}) {
  return (
    <div className="formGroup">
      {label && (
        <label className={`label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`inputField ${error ? 'textDanger' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...props}
      />
      {error && <span className="textDanger textSm">{error}</span>}
    </div>
  )
}
