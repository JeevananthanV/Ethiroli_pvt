import React, { useId } from 'react'

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
  const generatedId = useId()
  const inputId = props.id || props.name || generatedId

  return (
    <div className="formGroup">
      {label && (
        <label className={`label ${required ? 'required' : ''}`} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={props.name || inputId}
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
