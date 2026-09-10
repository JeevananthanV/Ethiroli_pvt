import React from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        {(title || onClose) && (
          <div className="modalHeader">
            {title && <h2 className="modalTitle">{title}</h2>}
            {onClose && (
              <button className="closeBtn" onClick={onClose}>
                &times;
              </button>
            )}
          </div>
        )}
        <div className="modalBody">{children}</div>
      </div>
    </div>
  )
}
