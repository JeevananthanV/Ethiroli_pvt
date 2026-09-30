import React, { useState } from 'react';

export default function Avatar({ name, src, size = 34, className = '', style = {} }) {
  const [hasError, setHasError] = useState(false);

  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  const showImage = Boolean(src && !hasError);

  return (
    <div
      className={`avatar ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setHasError(true)}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        initials
      )}
    </div>
  );
}
