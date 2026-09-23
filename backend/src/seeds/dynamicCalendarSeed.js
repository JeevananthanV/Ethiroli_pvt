import pool from './config/database.js';
import CalendarEventType from './models/CalendarEventType.js';
import CalendarRoleConfig from './models/CalendarRoleConfig.js';

const EVENT_TYPES = [
  {
    label: 'INTERVIEW',
    description: 'Job candidate or internal interview session',
    icon: 'video_call',
    defaultDuration: 30,
    color: '#10b981',
    allowedCreateRoles: ['HR', 'ADMIN', 'SUPER_ADMIN'],
    allowedWriteRoles: ['HR', 'ADMIN', 'SUPER_ADMIN'],
    notificationTargets: ['HR', 'ADMIN', 'TUTOR', 'PROJECT_MANAGER'],
    isActive: true,
    sortOrder: 1,
  },
  {
    label: 'TRAINING',
    description: 'Training session or workshop',
    icon: 'school',
    defaultDuration: 60,
    color: '#3b82f6',
    allowedCreateRoles: ['HR', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'],
    allowedWriteRoles: ['HR', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'],
    notificationTargets: ['TUTOR', 'ADMIN', 'HR'],
    isActive: true,
    sortOrder: 2,
  },
  {
    label: 'MEETING',
    description: 'General meeting or collaboration session',
    icon: 'group',
    defaultDuration: 30,
    color: '#8b5cf6',
    allowedCreateRoles: ['HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'RECEPTION'],
    allowedWriteRoles: ['HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
    notificationTargets: ['HR', 'ADMIN', 'PROJECT_MANAGER'],
    isActive: true,
    sortOrder: 3,
  },
  {
    label: 'DEADLINE',
    description: 'Task or project deadline',
    icon: 'flag',
    defaultDuration: 60,
    color: '#f59e0b',
    allowedCreateRoles: ['PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
    allowedWriteRoles: ['PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
    notificationTargets: ['PROJECT_MANAGER', 'ADMIN', 'HR'],
    isActive: true,
    sortOrder: 4,
  },
  {
    label: 'REMINDER',
    description: 'Generic reminder notification',
    icon: 'notifications',
    defaultDuration: 15,
    color: '#ef4444',
    allowedCreateRoles: ['EMPLOYEE', 'INTERN', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'],
    allowedWriteRoles: ['EMPLOYEE', 'INTERN', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'],
    notificationTargets: ['TUTOR', 'ADMIN', 'HR'],
    isActive: true,
    sortOrder: 5,
  },
  {
    label: 'EVALUATION',
    description: 'Performance evaluation or review session',
    icon: 'assessment',
    defaultDuration: 60,
    color: '#06b6d4',
    allowedCreateRoles: ['HR', 'ADMIN', 'SUPER_ADMIN'],
    allowedWriteRoles: ['HR', 'ADMIN', 'SUPER_ADMIN'],
    notificationTargets: ['HR', 'ADMIN', 'EMPLOYEE'],
    isActive: true,
    sortOrder: 6,
  },
  {
    label: 'ONBOARDING',
    description: 'Employee or intern onboarding session',
    icon: 'person_add',
    defaultDuration: 120,
    color: '#22c55e',
    allowedCreateRoles: ['HR', 'ADMIN', 'SUPER_ADMIN'],
    allowedWriteRoles: ['HR', 'ADMIN', 'SUPER_ADMIN'],
    notificationTargets: ['HR', 'ADMIN', 'EMPLOYEE'],
    isActive: true,
    sortOrder: 7,
  },
  {
    label: 'SHUTDOWN',
    description: 'System maintenance or service shutdown',
    icon: 'build',
    defaultDuration: 60,
    color: '#6b7280',
    allowedCreateRoles: ['ADMIN', 'SUPER_ADMIN'],
    allowedWriteRoles: ['ADMIN', 'SUPER_ADMIN'],
    notificationTargets: ['SUPER_ADMIN', 'ADMIN', 'HR'],
    isActive: true,
    sortOrder: 8,
  },
];

const ROLE_CONFIGS = [
  {
    role: 'SUPER_ADMIN',
    enabledEventTypes: ['INTERVIEW', 'TRAINING', 'MEETING', 'DEADLINE', 'REMINDER', 'EVALUATION', 'ONBOARDING', 'SHUTDOWN'],
    notificationChannels: ['email', 'sms', 'push', 'in_app'],
    isEnabled: true,
  },
  {
    role: 'ADMIN',
    enabledEventTypes: ['INTERVIEW', 'TRAINING', 'MEETING', 'DEADLINE', 'REMINDER', 'EVALUATION', 'ONBOARDING', 'SHUTDOWN'],
    notificationChannels: ['email', 'push', 'in_app'],
    isEnabled: true,
  },
  {
    role: 'HR',
    enabledEventTypes: ['INTERVIEW', 'TRAINING', 'MEETING', 'DEADLINE', 'REMINDER', 'EVALUATION', 'ONBOARDING', 'SHUTDOWN'],
    notificationChannels: ['email', 'push', 'in_app'],
    isEnabled: true,
  },
  {
    role: 'TUTOR',
    enabledEventTypes: ['TRAINING', 'MEETING', 'REMINDER'],
    notificationChannels: ['email', 'push', 'in_app'],
    isEnabled: true,
  },
  {
    role: 'PROJECT_MANAGER',
    enabledEventTypes: ['MEETING', 'DEADLINE', 'REMINDER'],
    notificationChannels: ['email', 'push', 'in_app'],
    isEnabled: true,
  },
  {
    role: 'FINANCE',
    enabledEventTypes: ['REMINDER'],
    notificationChannels: ['email', 'push'],
    isEnabled: true,
  },
  {
    role: 'SALES',
    enabledEventTypes: ['MEETING', 'REMINDER'],
    notificationChannels: ['email', 'push', 'in_app'],
    isEnabled: true,
  },
  {
    role: 'RECEPTION',
    enabledEventTypes: ['MEETING', 'REMINDER'],
    notificationChannels: ['email'],
    isEnabled: true,
  },
  {
    role: 'EMPLOYEE',
    enabledEventTypes: ['MEETING', 'DEADLINE', 'REMINDER', 'EVALUATION'],
    notificationChannels: ['email', 'push', 'in_app'],
    isEnabled: true,
  },
  {
    role: 'STUDENT',
    enabledEventTypes: ['TRAINING', 'REMINDER'],
    notificationChannels: ['email', 'push'],
    isEnabled: true,
  },
];

const seedEventTypes = async () => {
  for (const eventType of EVENT_TYPES) {
    try {
      await CalendarEventType.findByType(eventType.label);
      console.log(`Event type ${eventType.label} already exists, skipping...`);
    } catch {
      const id = await CalendarEventType.create(eventType);
      console.log(`Created event type: ${eventType.label} (id: ${id})`);
    }
  }
};

const seedRoleConfigs = async () => {
  for (const config of ROLE_CONFIGS) {
    try {
      await CalendarRoleConfig.upsert(config);
      console.log(`Seeded role config for: ${config.role}`);
    } catch (error) {
      console.error(`Failed to seed role config for ${config.role}:`, error.message);
    }
  }
};

const seedDynamicCalendar = async () => {
  try {
    await seedEventTypes();
    await seedRoleConfigs();
    console.log('Dynamic calendar seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

export default seedDynamicCalendar;