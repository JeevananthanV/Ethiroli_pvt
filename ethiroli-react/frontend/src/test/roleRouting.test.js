import { describe, it, expect } from 'vitest';
import { ROLES, getRoleDefaultPath, isRoleAuthorized } from '../common/utils/roleRouting';

describe('roleRouting', () => {
  it('returns default path for SUPER_ADMIN', () => {
    expect(getRoleDefaultPath(ROLES.SUPER_ADMIN)).toBe('/app/super-admin/dashboard');
  });

  it('returns default path for ADMIN', () => {
    expect(getRoleDefaultPath(ROLES.ADMIN)).toBe('/app/admin/dashboard');
  });

  it('returns default path for HR', () => {
    expect(getRoleDefaultPath(ROLES.HR)).toBe('/app/hr/dashboard');
  });

  it('returns default path for TUTOR', () => {
    expect(getRoleDefaultPath(ROLES.TUTOR)).toBe('/app/tutor/dashboard');
  });

  it('returns default path for PROJECT_MANAGER', () => {
    expect(getRoleDefaultPath(ROLES.PROJECT_MANAGER)).toBe('/app/pm/dashboard');
  });

  it('returns default path for FINANCE', () => {
    expect(getRoleDefaultPath(ROLES.FINANCE)).toBe('/app/finance/dashboard');
  });

  it('returns default path for SALES', () => {
    expect(getRoleDefaultPath(ROLES.SALES)).toBe('/app/sales/dashboard');
  });

  it('returns default path for RECEPTION', () => {
    expect(getRoleDefaultPath(ROLES.RECEPTION)).toBe('/app/reception/dashboard');
  });

  it('returns default path for EMPLOYEE', () => {
    expect(getRoleDefaultPath(ROLES.EMPLOYEE)).toBe('/app/employee/dashboard');
  });

  it('returns default path for STUDENT', () => {
    expect(getRoleDefaultPath(ROLES.STUDENT)).toBe('/app/student/dashboard');
  });

  it('returns default path for INTERN', () => {
    expect(getRoleDefaultPath(ROLES.INTERN)).toBe('/app/intern/dashboard');
  });

  it('returns fallback login path for unknown role', () => {
    expect(getRoleDefaultPath('UNKNOWN')).toBe('/app/login');
  });

  it('authorizes allowed roles', () => {
    expect(isRoleAuthorized(ROLES.ADMIN, [ROLES.SUPER_ADMIN, ROLES.ADMIN])).toBe(true);
  });

  it('rejects unauthorized roles', () => {
    expect(isRoleAuthorized(ROLES.STUDENT, [ROLES.SUPER_ADMIN, ROLES.ADMIN])).toBe(false);
  });

  it('returns true when no allowed roles specified', () => {
    expect(isRoleAuthorized(ROLES.STUDENT, [])).toBe(true);
  });

  it('returns false for null user role', () => {
    expect(isRoleAuthorized(null, [ROLES.ADMIN])).toBe(false);
  });
});