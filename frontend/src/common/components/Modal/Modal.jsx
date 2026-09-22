import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h3 className="modalTitle">{title}</h3>
          <button className="closeBtn" onClick={onClose}>&times;</button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
