import { useEffect } from 'react';

/**
 * Makes a hand-rolled modal behave like a real one.
 *
 * These modals are React conditional renders, not Bootstrap's JS (which is not
 * loaded in this project), so they get none of Bootstrap's dismissal
 * behaviour for free. Without this, a modal can only be closed by finding the
 * X button: Escape does nothing, and the page scrolls freely behind it.
 *
 * @param {boolean} open   whether the modal is currently rendered
 * @param {Function} onClose called on Escape
 */
export function useModalDismiss(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);

    // Stop the page scrolling behind the overlay. Preserves any scrollbar
    // width so the layout doesn't shift sideways as it disappears.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [open, onClose]);
}

/**
 * onClick handler for a modal overlay. Fires only when the backdrop itself is
 * clicked, not when the click starts inside the dialog and bubbles out.
 */
export function backdropClick(onClose) {
  return (e) => {
    if (e.target === e.currentTarget) onClose();
  };
}
