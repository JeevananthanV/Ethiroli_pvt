import CalendarEventType from '../models/CalendarEventType.js';
import { ROLES } from '../config/constants.js';

export const eventTypeService = {
  async getAll(isActive = true) {
    return CalendarEventType.list({ isActive });
  },

  async getById(id) {
    return CalendarEventType.findById(id);
  },

  async getByType(typeOrId) {
    return CalendarEventType.findByType(typeOrId);
  },

  async create(data) {
    return CalendarEventType.create(data);
  },

  async update(id, updates) {
    return CalendarEventType.update(id, updates);
  },

  async delete(id) {
    return CalendarEventType.delete(id);
  },

  async getTypesForRole(role) {
    const all = await this.getAll(true);
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      return all;
    }

    return all.filter(type => {
      const createRoles = type.allowed_create_roles || [];
      const writeRoles = type.allowed_write_roles || [];
      return (
        createRoles.includes('ALL') ||
        createRoles.includes(role) ||
        writeRoles.includes('ALL') ||
        writeRoles.includes(role)
      );
    });
  },

  async canRoleCreateType(role, eventTypeIdOrLabel) {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') return true;
    const type = await this.getByType(eventTypeIdOrLabel);
    if (!type) return false;
    const allowed = type.allowed_create_roles || [];
    return allowed.includes('ALL') || allowed.includes(role);
  },

  async canRoleWriteType(role, eventTypeIdOrLabel) {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') return true;
    const type = await this.getByType(eventTypeIdOrLabel);
    if (!type) return false;
    const allowed = type.allowed_write_roles || [];
    return allowed.includes('ALL') || allowed.includes(role);
  }
};

export default eventTypeService;
