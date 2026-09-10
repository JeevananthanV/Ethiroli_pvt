import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="userMenu" ref={ref}>
      <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>
      {open && (
        <div className="dropdown" style={{ right: align === 'right' ? 0 : 'auto', left: align === 'left' ? 0 : 'auto' }}>
          {children}
        </div>
      )}
    </div>
  );
}
