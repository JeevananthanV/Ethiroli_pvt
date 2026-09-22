import React from 'react'

export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const classes = ['btn', variant, className].filter(Boolean).join(' ')
  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
