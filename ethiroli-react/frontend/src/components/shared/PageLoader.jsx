import React from 'react';

const PageLoader = ({ isLoading = true, text = 'Loading...', size = 'medium' }) => {
  if (!isLoading) return null;

  return (
    <div className="page-loader" aria-live="polite" aria-busy="true" aria-label={text}>
      <div className="page-loader-spinner" data-size={size} />
      {text && <p className="page-loader-text">{text}</p>}
    </div>
  );
};

export default PageLoader;
