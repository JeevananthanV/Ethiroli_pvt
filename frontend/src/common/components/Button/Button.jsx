import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', className = '', ...props }) => {
  const variantClass = variant === 'secondary' ? 'secondary' : variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'primary';
  const sizeClass = size === 'sm' ? 'btnSm' : size === 'lg' ? 'btnLg' : '';
  
  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
