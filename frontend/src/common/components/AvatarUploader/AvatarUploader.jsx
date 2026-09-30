import React, { useRef, useState } from 'react';
import './AvatarUploader.css';

/**
 * AvatarUploader - Premium interactive profile picture uploader
 * Supports instant drag-and-drop, client-side canvas compression,
 * file-picker fallback, remove photo, and error fallbacks.
 */
export default function AvatarUploader({
  value,
  onChange,
  name = 'User',
  size = 110,
  disabled = false,
  subtitle = 'Allowed formats: JPG, PNG, WEBP (auto-compressed)'
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [processing, setProcessing] = useState(false);

  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // High quality max 400x400 compression canvas
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setImgError(false);
        setProcessing(false);
        if (onChange) {
          onChange(dataUrl);
        }
      };
      img.onerror = () => {
        setProcessing(false);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => setProcessing(false);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setImgError(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onChange) {
      onChange(null);
    }
  };

  const hasPhoto = Boolean(value && !imgError);

  return (
    <div className="avatar-uploader-container">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={disabled}
      />

      <div
        className={`avatar-uploader-wrapper ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        style={{ width: size, height: size }}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        title="Click or drag an image here to update profile photo"
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        {hasPhoto ? (
          <img
            src={value}
            alt={name}
            className="avatar-uploader-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="avatar-uploader-initials" style={{ fontSize: `${size * 0.38}px` }}>
            {initials}
          </div>
        )}

        <div className="avatar-uploader-overlay">
          {processing ? (
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="visually-hidden">Compressing...</span>
            </div>
          ) : (
            <>
              <i className="bi bi-camera-fill avatar-uploader-icon"></i>
              <span className="avatar-uploader-hover-label">Change</span>
            </>
          )}
        </div>

        <div className="avatar-uploader-badge">
          <i className="bi bi-camera-fill"></i>
        </div>
      </div>

      <div className="avatar-uploader-controls">
        <div className="d-flex gap-2 align-items-center">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm px-3"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || processing}
          >
            <i className="bi bi-upload me-1"></i> {hasPhoto ? 'Change Photo' : 'Upload Photo'}
          </button>
          {hasPhoto && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm px-2"
              onClick={handleRemove}
              disabled={disabled || processing}
              title="Remove Profile Photo"
            >
              <i className="bi bi-trash3 me-1"></i> Remove
            </button>
          )}
        </div>
        {subtitle && <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>{subtitle}</small>}
      </div>
    </div>
  );
}
