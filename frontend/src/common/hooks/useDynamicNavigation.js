import { useState, useEffect, useCallback } from 'react';
import { getRoleNavigation } from '../../services/api/roleApi.js';
import { getNavigationForRole } from '../layout/navigationConfig.js';

// In-memory cache to prevent redundant network trips
const navCache = new Map();

/**
 * Custom hook to load dynamic, database-driven portal navigation
 * @param {string} role - The current user role
 * @returns {{ navigation: Array, loading: boolean, error: string|null, refreshNavigation: Function }}
 */
export function useDynamicNavigation(role) {
  const normalizedRole = role ? String(role).trim().toUpperCase() : null;
  const initialNav = normalizedRole ? (navCache.get(normalizedRole) || getNavigationForRole(normalizedRole)) : [];

  const [navigation, setNavigation] = useState(initialNav);
  const [loading, setLoading] = useState(!navCache.has(normalizedRole));
  const [error, setError] = useState(null);

  const fetchNavigation = useCallback(async (force = false) => {
    if (!normalizedRole) return;

    if (!force && navCache.has(normalizedRole)) {
      setNavigation(navCache.get(normalizedRole));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getRoleNavigation();
      const serverNav = data?.navigation || data?.data?.navigation || null;

      if (Array.isArray(serverNav) && serverNav.length > 0) {
        navCache.set(normalizedRole, serverNav);
        setNavigation(serverNav);
      } else {
        const fallback = getNavigationForRole(normalizedRole);
        setNavigation(fallback);
      }
    } catch (err) {
      console.warn(`[Dynamic Navigation] Falling back to default configuration for ${normalizedRole}:`, err.message);
      const fallback = getNavigationForRole(normalizedRole);
      setNavigation(fallback);
      setError(err.message || 'Failed to fetch database navigation');
    } finally {
      setLoading(false);
    }
  }, [normalizedRole]);

  useEffect(() => {
    fetchNavigation();
  }, [fetchNavigation]);

  // Listen to cross-component or socket navigation update broadcasts
  useEffect(() => {
    const handleNavUpdate = (e) => {
      if (!e.detail?.role || e.detail.role === normalizedRole) {
        fetchNavigation(true);
      }
    };

    window.addEventListener('ethiroli_navigation_updated', handleNavUpdate);
    return () => {
      window.removeEventListener('ethiroli_navigation_updated', handleNavUpdate);
    };
  }, [normalizedRole, fetchNavigation]);

  const refreshNavigation = useCallback(() => {
    return fetchNavigation(true);
  }, [fetchNavigation]);

  return {
    navigation,
    loading,
    error,
    refreshNavigation
  };
}

export default useDynamicNavigation;
