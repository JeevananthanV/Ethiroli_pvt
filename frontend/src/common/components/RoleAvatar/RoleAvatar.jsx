import React, { useState } from 'react';
import { ROLES } from '../../utils/roleRouting.js';

/**
 * Roles that use the Ethiroli brand mark as their default profile picture
 * instead of the plain initial-letter placeholder.
 */
const LOGO_ROLES = [ROLES.PROJECT_MANAGER];

export const ROLE_LOGO_SRC = '/assets/images/ethiroli_logo.png';

/**
 * RoleAvatar - one avatar renderer for every surface that shows "who am I".
 *
 * Resolution order:
 *   1. the user's own uploaded avatar, when it loads
 *   2. the Ethiroli brand mark, for brand-logo roles (e.g. Project Manager)
 *   3. the first letter of the display name / email
 *
 * A broken avatar URL or a missing logo file falls through to the next option
 * instead of leaving a blank circle behind.
 *
 * @param {object}   props
 * @param {string}   props.src        Avatar image URL (user upload).
 * @param {string}   props.role       Role enum, used to pick the brand mark.
 * @param {string}   props.name       Used for the initial-letter fallback.
 * @param {string}   props.className  Wrapper class (e.g. "portalAvatar").
 * @param {string}   props.title      Hover title.
 */
export default function RoleAvatar({
  src,
  role,
  name,
  email,
  className = '',
  style,
  title,
  children
}) {
  const [failed, setFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const label = name || email || 'User';
  const initial = String(label).charAt(0).toUpperCase();
  const useLogo = !failed && !src && LOGO_ROLES.includes(role) && !logoFailed;

  return (
    <div className={className} style={style} title={title || label}>
      {useLogo ? (
        <img
          src={ROLE_LOGO_SRC}
          alt={label}
          onError={() => setLogoFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: 'inherit',
            background: 'rgba(255, 255, 255, 0.92)',
            padding: 2
          }}
        />
      ) : src && !failed ? (
        <img
          src={src}
          alt={label}
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
        />
      ) : (
        children || initial
      )}
    </div>
  );
}
