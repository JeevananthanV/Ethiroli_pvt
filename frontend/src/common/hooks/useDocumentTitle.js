import { useEffect, useRef } from 'react';

/**
 * Normalizes role codes into user-friendly display labels.
 * e.g., "SUPER_ADMIN" -> "Super Admin", "PROJECT_MANAGER" -> "Project Manager"
 */
export function formatRoleName(role) {
  if (!role) return '';
  const clean = String(role).trim();
  const map = {
    SUPER_ADMIN: 'Super Admin',
    HR_SUPERADMIN: 'HR Super Admin',
    ADMIN: 'Admin',
    HR: 'HR Management',
    SENIOR_TUTOR: 'Senior Tutor',
    TUTOR: 'Tutor',
    PROJECT_MANAGER: 'Project Manager',
    PM: 'Project Manager',
    FINANCE: 'Finance',
    SALES: 'Sales & Marketing',
    RECEPTION: 'Reception Desk',
    EMPLOYEE: 'Employee Portal',
    INTERN: 'Internship Portal',
    STUDENT: 'Student Portal'
  };
  if (map[clean]) return map[clean];
  return clean
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * useDocumentTitle Hook
 * Dynamically updates document.title based on page name, active user role, or role being managed.
 * Restores previous title upon unmount if restoreOnUnmount is enabled.
 *
 * @param {string} pageTitle - The current page or view name (e.g., 'Profile Settings', 'User Management')
 * @param {Object} options - Configuration options
 * @param {string} [options.role] - Current logged-in user role or context
 * @param {string} [options.managedRole] - Optional role being actively managed or filtered
 * @param {string} [options.appName] - Brand / app name suffix (defaults to 'Ethiroli Enterprise')
 * @param {boolean} [options.restoreOnUnmount] - Whether to restore the original title on cleanup
 */
export default function useDocumentTitle(pageTitle, options = {}) {
  const {
    role,
    managedRole,
    appName = 'Ethiroli Enterprise',
    restoreOnUnmount = false
  } = options;

  const previousTitleRef = useRef(document.title);

  useEffect(() => {
    const parts = [];

    if (pageTitle && pageTitle.trim()) {
      parts.push(pageTitle.trim());
    }

    if (managedRole) {
      parts.push(`Managing ${formatRoleName(managedRole)}`);
    } else if (role) {
      parts.push(formatRoleName(role));
    }

    if (appName) {
      parts.push(appName);
    }

    const newTitle = parts.join(' | ') || appName;
    document.title = newTitle;

    return () => {
      if (restoreOnUnmount && previousTitleRef.current) {
        document.title = previousTitleRef.current;
      }
    };
  }, [pageTitle, role, managedRole, appName, restoreOnUnmount]);
}
