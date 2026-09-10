import React from 'react';
import Button from '../../common/components/Button/Button.jsx';

const PROVIDER_LABELS = {
  google: 'Continue with Google',
  microsoft: 'Continue with Microsoft',
  linkedin: 'Continue with LinkedIn',
};

export default function OAuthButton({ provider, onClick }) {
  const handleClick = () => {
    onClick?.(provider);
  };

  return (
    <Button type="button" variant="secondary" onClick={handleClick}>
      {PROVIDER_LABELS[provider] || `Continue with ${provider}`}
    </Button>
  );
}
