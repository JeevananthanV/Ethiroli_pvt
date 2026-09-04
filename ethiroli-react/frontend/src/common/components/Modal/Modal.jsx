import React from 'react';
import Button from '../Button/Button';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h3 className="modalTitle">{title}</h3>
          <button className="closeBtn" onClick={onClose}>&times;</button>
        </div>
        <div className="modalBody">
          {children}
        </div>
      </div>
    </div>
  );
}