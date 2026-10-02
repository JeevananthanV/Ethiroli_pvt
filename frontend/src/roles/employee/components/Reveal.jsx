import React from 'react';

/**
 * Reveal - lightweight entrance animation wrapper for the Employee portal.
 *
 * Deliberately CSS-driven (no framer-motion) so it adds zero bundle weight and
 * degrades gracefully. Honours the global `prefers-reduced-motion` rule that is
 * handled in employee-portal.css.
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  return (
    <Tag
      className={`emp-reveal ${className}`.trim()}
      style={{ '--emp-delay': `${delay}ms`, ...(rest.style || {}) }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Stagger - maps Reveal over a list with a per-item delay so grids cascade in.
 */
export function Stagger({ items = [], step = 60, base = 0, render, as: Tag = 'div', className = '', ...rest }) {
  return (
    <Tag className={className} {...rest}>
      {items.map((item, i) => (
        <Reveal key={item?.id ?? i} delay={base + i * step}>
          {render(item, i)}
        </Reveal>
      ))}
    </Tag>
  );
}

export default Reveal;