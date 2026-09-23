import CalendarRoleConfig from '../models/CalendarRoleConfig.js';
import CalendarEventType from '../models/CalendarEventType.js';

export const calendarRoleConfigService = {
  async getConfigForRole(role) {
    let config = await CalendarRoleConfig.findByRole(role);
    if (!config) {
      // Default fallback if role config not yet created
      config = {
        role,
        calendar_title: `${role} Calendar`,
        default_view: 'month',
        work_start_time: '09:00:00',
        work_end_time: '18:00:00',
        show_others_events: true,
        event_type_visibility: [],
        quick_create_types: [],
        is_active: true
      };
    }

    // Attach allowed event types for quick reference by the frontend
    const allTypes = await CalendarEventType.list({ isActive: true });
    const allowedTypes = allTypes.filter(t => {
      if (role === 'SUPER_ADMIN' || role === 'ADMIN') return true;
      const creates = t.allowed_create_roles || [];
      const writes = t.allowed_write_roles || [];
      return creates.includes('ALL') || creates.includes(role) || writes.includes('ALL') || writes.includes(role);
    });

    return {
      ...config,
      allowed_event_types: allowedTypes
    };
  },

  async upsertConfig(role, configData) {
    return CalendarRoleConfig.upsert({
      role,
      ...configData
    });
  },

  async getAllConfigs() {
    return CalendarRoleConfig.list();
  }
};

export default calendarRoleConfigService;
