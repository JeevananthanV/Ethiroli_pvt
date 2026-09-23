# Dynamic Calendar — Implementation Plan

**Workspace:** J:\eithiroli\ethiroli_react
**Date:** 2026-09-23
**Status:** Proposed — Ready for Review

---

## 1. Vision

Build a **fully dynamic, role-aware calendar system** where:
- Every role has its own calendar view with events tailored to its responsibilities
- Event types are dynamic and configurable per role (not hardcoded)
- Recurring commitments auto-generate future instances
- Notifications route to relevant roles, not universally to HR
- The calendar adapts to role permissions without code changes for new roles

---

## 2. Current State Analysis

### 2.1 What Exists Today

| Component | File | Status |
|-----------|------|--------|
| Event Model | `backend/src/models/CalendarEvent.js` | Basic CRUD, supports `recurrence_rule` field (unused) |
| Event Controller | `backend/src/controllers/calendarController.js` | 5 endpoints, all broadcasts to HR |
| Event Routes | `backend/src/routes/calendarRoutes.js` | Role-gated, read access for 8 roles |
| Calendar Slice | `frontend/src/store/slices/calendarSlice.js` | Basic fetch, no filtering |
| Calendar API | `frontend/src/services/api/calendarApi.js` | 3 methods (getEvents, createEvent, listEvents alias) |
| Calendar Sync | `backend/src/services/calendarSyncService.js` | Separate sync service with different schema |
| RBAC | `backend/src/middleware/rbac.js` | Full permission system, unused for calendar granularity |
| Socket Service | `backend/src/services/socketService.js` | Supports role-based broadcast and user-based broadcast |
| Validation | `backend/src/middleware/validation.js` | Schema-based validation, supports enums |
| Navigation | `backend/src/config/navigationConfig.js` | Role-based nav, calendar items for 6 of 13 roles |
| Role Routing | `frontend/src/common/utils/roleRouting.js` | Role enums + default paths |
| Permissions | `backend/src/config/constants.js` | 13 roles defined, `RECURRING_FREQUENCY` enum exists |

### 2.2 What's Missing

| Gap | Impact |
|-----|--------|
| No role-specific event filtering | All roles see all events |
| `recurrence_rule` stored but never expanded | Recurring events show as single entries |
| Universal HR broadcast | Every role gets HR-irrelevant notifications |
| FINANCE/SALES/STUDENT/INTERN/TUTOR cannot create events | Can't schedule their own commitments |
| No event type taxonomy | No distinction between interviews, classes, meetings, etc. |
| No calendar page components exist | No frontend calendar UI at all |
| No dynamic event configuration | Event types hardcoded in business logic |
| No cross-system event integration | Interviews in separate table, not on calendar |

---

## 3. Architecture

### 3.1 High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                                │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │ Calendar │  │ Event    │  │ Recurring│  │  Dynamic Event   │    │
│  │ Page     │  │ Form     │  │ Engine   │  │  Type Config     │    │
│  │ (role-   │  │ (dynamic │  │ (auto    │  │  (Admin-only     │    │
│  │  aware)  │  │  per     │  │  generate)│  │   admin panel)   │    │
│  │          │  │  role)   │  │          │  │                  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘    │
│       │              │              │                  │              │
│  ┌────┴──────────────┴──────────────┴──────────────────┴─────┐      │
│  │              Redux Calendar Slice (role-aware)             │      │
│  └────────────────────────┬──────────────────────────────────┘      │
│                           │ API calls                               │
│  ┌────────────────────────┴──────────────────────────────────┐      │
│  │  Dynamic Calendar API Client                              │      │
│  │  - /calendar/events?role=&type=&start=&end=&assignedTo=   │      │
│  │  - /calendar/types (role-specific event types)             │      │
│  │  - /calendar/recurring/expand (instance generation)       │      │
│  └────────────────────────┬──────────────────────────────────┘      │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────────┐
│                      BACKEND LAYER                                  │
│                                                                     │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────────────┐      │
│  │ Calendar    │  │ Recurring    │  │  Dynamic Event Type     │      │
│  │ Controller  │  │ Event        │  │  Admin Controller       │      │
│  │ (new)       │  │ Service      │  │  (CRUD for types)       │      │
│  └─────┬──────┘  └──────┬───────┘  └────────────┬────────────┘      │
│        │                │                        │                   │
│  ┌─────┴────────────────┴────────────────────────┴─────────────┐    │
│  │              Calendar Service Layer                          │    │
│  │  - EventService (CRUD + role-aware queries)                 │    │
│  │  - RecurringEventEngine (RRULE expansion)                   │    │
│  │  - NotificationRouter (role-aware dispatch)                 │    │
│  │  - EventTypeService (dynamic type management)               │    │
│  └────────────────────────┬────────────────────────────────────┘    │
│                           │                                        │
│  ┌────────────────────────┴────────────────────────────────────┐    │
│  │  Models                                                     │    │
│  │  - CalendarEvent (enhanced)                                 │    │
│  │  - CalendarEventType (NEW)                                  │    │
│  │  - CalendarRoleConfig (NEW)                                 │    │
│  │  - RecurringRule (NEW)                                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Dynamic Flow

```
Admin defines event types → stored in calendar_event_types table
                         → each type has: label, icon, defaultDuration, 
                           allowedRoles (create/write/read), 
                           notificationTargets (roles to notify)
                         
User creates event → selects type from their role's allowed types
                   → system validates role permissions against type config
                   → if recurring, RecurringEventEngine stores rule + 
                     generates instances up to end_date
                   → NotificationRouter dispatches to type's target roles

User views calendar → backend filters events by:
                     - User's role (read permission)
                     - User's ID (assigned_to or created_by)
                     - Query params (date range, type)
                     - Returns only relevant events
```

---

## 4. Data Model Changes

### 4.1 New Table: `calendar_event_types`

```sql
CREATE TABLE calendar_event_types (
  id VARCHAR(36) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,           -- "Interview", "Class", "Meeting"
  description TEXT,
  icon VARCHAR(50) DEFAULT 'event',      -- material icon name
  default_duration_minutes INT DEFAULT 30,
  color VARCHAR(7) DEFAULT '#6366f1',    -- hex color for calendar rendering
  allowed_create_roles JSON NOT NULL DEFAULT '[]',  -- roles that can create
  allowed_write_roles JSON NOT NULL DEFAULT '[]',   -- roles that can edit
  notification_target_roles JSON NOT NULL DEFAULT '[]', -- roles to notify
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Seed Data:**

| ID | Label | Icon | Create Roles | Write Roles | Notify Targets |
|----|-------|------|-------------|------------|----------------|
| evt_interview | Interview | record_voice_over | HR,PM,ADMIN,SUPER_ADMIN | HR,PM,ADMIN,SUPER_ADMIN | HR,PM |
| evt_class | Class | menu_book | TUTOR,ADMIN,SUPER_ADMIN | TUTOR,ADMIN,SUPER_ADMIN | TUTOR,STUDENT |
| evt_quiz | Quiz | quiz | TUTOR,ADMIN,SUPER_ADMIN | TUTOR,ADMIN,SUPER_ADMIN | TUTOR,STUDENT |
| evt_meeting | Meeting | groups | HR,PM,EMPLOYEE,INTERN,SUPER_ADMIN,ADMIN | Same | assigned users |
| evt_training | Training | school | HR,ADMIN,SUPER_ADMIN | HR,ADMIN,SUPER_ADMIN | HR,EMPLOYEE,INTERN |
| evt_milestone | Milestone | flag | PM,ADMIN,SUPER_ADMIN | PM,ADMIN,SUPER_ADMIN | PM,EMPLOYEE |
| evt_payment | Payment | payments | FINANCE,ADMIN,SUPER_ADMIN | FINANCE,ADMIN,SUPER_ADMIN | FINANCE,ADMIN |
| evt_call | Sales Call | telephone | SALES,ADMIN,SUPER_ADMIN | SALES,ADMIN,SUPER_ADMIN | SALES |
| evt_appointment | Appointment | calendar_check | RECEPTION,ADMIN,SUPER_ADMIN | RECEPTION,ADMIN,SUPER_ADMIN | RECEPTION |
| evt_leave | Leave | event_busy | EMPLOYEE,INTERN,SUPER_ADMIN,ADMIN | EMPLOYEE,INTERN,HR,ADMIN,SUPER_ADMIN | HR,EMPLOYEE,INTERN |
| evt_deadline | Deadline | schedule | ALL ROLES | ALL ROLES | creator only |
| evt_holiday | Holiday | calendar_month | ADMIN,HR,SUPER_ADMIN | ADMIN,HR,SUPER_ADMIN | ALL ROLES |

### 4.2 Enhanced `calendar_events` Table

```sql
ALTER TABLE calendar_events
  ADD COLUMN event_type_id VARCHAR(36) DEFAULT NULL,    -- links to types table
  ADD COLUMN status ENUM('scheduled','completed','cancelled','postponed') DEFAULT 'scheduled',
  ADD COLUMN priority ENUM('low','medium','high','urgent') DEFAULT 'medium',
  ADD COLUMN tags JSON DEFAULT NULL,                     -- ["urgent","client-meeting"]
  ADD COLUMN recurrence_end_date DATE DEFAULT NULL,      -- when recurring stops
  ADD COLUMN recurrence_instance_count INT DEFAULT NULL, -- max instances generated
  ADD COLUMN index_key VARCHAR(100) DEFAULT NULL,        -- for dedup of recurring instances
  ADD COLUMN parent_event_id VARCHAR(36) DEFAULT NULL,   -- for recurring child events
  ADD COLUMN cancelled_instance_dates JSON DEFAULT NULL,  -- dates skipped in recurrence
  ADD INDEX idx_role_filter (event_type_id, status),
  ADD INDEX idx_assigned (assigned_users(255)),
  ADD INDEX idx_parent (parent_event_id);

-- Foreign key (application-level, no DB FK enforcement in current pattern)
-- calendar_events.event_type_id → calendar_event_types.id
```

### 4.3 New Table: `calendar_role_configs`

```sql
CREATE TABLE calendar_role_configs (
  id VARCHAR(36) PRIMARY KEY,
  role VARCHAR(50) NOT NULL,                             -- e.g. "HR", "FINANCE"
  calendar_title VARCHAR(100) DEFAULT 'Calendar',        -- role's calendar page title
  default_view ENUM('day','week','month','agenda') DEFAULT 'month',
  work_start_time TIME DEFAULT '09:00:00',
  work_end_time TIME DEFAULT '18:00:00',
  show_others_events BOOLEAN DEFAULT true,               -- show team events?
  event_type_visibility JSON DEFAULT '[]',               -- which types to show (empty = all)
  quick_create_types JSON DEFAULT '[]',                  -- types shown in quick-create button
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_role (role)
);
```

### 4.4 New Table: `recurring_rules` (expanded from existing field)

```sql
CREATE TABLE recurring_rules (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL,                         -- parent calendar event
  frequency ENUM('DAILY','WEEKLY','MONTHLY','YEARLY') NOT NULL,
  interval INT DEFAULT 1,                                -- every N units
  days_of_week JSON DEFAULT NULL,                        -- [0,1,2,...] for weekly
  day_of_month INT DEFAULT NULL,                         -- for monthly
  month_of_year INT DEFAULT NULL,                        -- for yearly
  end_date DATE DEFAULT NULL,                            -- when to stop
  max_occurrences INT DEFAULT NULL,                      -- max instances
  instance_count INT DEFAULT 0,                          -- how many generated
  next_occurrence DATE DEFAULT NULL,                     -- when next fires
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY KEY fk_event (event_id) 
);
```

---

## 5. Backend Implementation

### 5.1 New Files

| File | Purpose |
|------|---------|
| `backend/src/services/eventTypeService.js` | CRUD for dynamic event types, role-permission binding |
| `backend/src/services/recurringEngine.js` | RRULE expansion, instance generation, skip logic |
| `backend/src/services/notificationRouter.js` | Smart notification dispatch based on event type |
| `backend/src/services/calendarRoleConfigService.js` | Per-role calendar configuration |
| `backend/src/models/CalendarEventType.js` | Model for event types table |
| `backend/src/models/RecurringRule.js` | Model for recurring rules table |
| `backend/src/models/CalendarRoleConfig.js` | Model for role configs table |
| `backend/src/controllers/eventTypeController.js` | Admin API for managing types |
| `backend/src/controllers/recurringController.js` | Recurrence management endpoints |
| `backend/src/controllers/calendarRoleConfigController.js` | Role calendar config API |
| `backend/src/routes/eventTypeRoutes.js` | Routes for type management |
| `backend/src/routes/recurringRoutes.js` | Routes for recurrence operations |
| `backend/src/routes/calendarRoleConfigRoutes.js` | Routes for role configs |
| `backend/src/store/slices/calendarSlice.js` | Enhanced with filters, types, configs |
| `frontend/src/services/api/calendarEventTypeApi.js` | API client for event types |
| `frontend/src/services/api/recurringApi.js` | API client for recurrence |
| `frontend/src/pages/calendar/CalendarPage.jsx` | Main calendar UI |
| `frontend/src/pages/calendar/EventTypeAdmin.jsx` | Admin panel for types |
| `frontend/src/pages/calendar/RecurringConfig.jsx` | Recurrence setup UI |

### 5.2 Enhanced Files

| File | Changes |
|------|---------|
| `backend/src/models/CalendarEvent.js` | Add `event_type_id`, `status`, `priority`, `parent_event_id`, enhanced list with role filtering |
| `backend/src/controllers/calendarController.js` | Replace universal HR broadcast with NotificationRouter; add role-aware list; add event_type_id filtering |
| `backend/src/routes/calendarRoutes.js` | Add type filtering, role-aware query params, update permissions |
| `backend/src/config/navigationConfig.js` | Add Calendar nav item for ADMIN, TUTOR, SALES, STUDENT |
| `backend/src/config/constants.js` | Add `calendar:manage_types` permission for ADMIN/SUPER_ADMIN |
| `frontend/src/store/slices/calendarSlice.js` | Add filters, types, configs, selectedDate state |
| `frontend/src/services/api/calendarApi.js` | Add listByRole, getTypes, getRoleConfig, expandRecurring |

### 5.3 Core Service: `eventTypeService.js`

```javascript
// backend/src/services/eventTypeService.js
import CalendarEventType from '../models/CalendarEventType.js';

export const eventTypeService = {
  async getAll(isActive = true) {
    return CalendarEventType.list({ isActive });
  },

  async getById(id) {
    return CalendarEventType.findById(id);
  },

  async create({ label, description, icon, defaultDuration, color, 
                allowedCreateRoles, allowedWriteRoles, notificationTargets }) {
    const id = crypto.randomUUID();
    await CalendarEventType.create({
      id, label, description, icon, defaultDuration, color,
      allowedCreateRoles: JSON.stringify(allowedCreateRoles),
      allowedWriteRoles: JSON.stringify(allowedWriteRoles),
      notificationTargets: JSON.stringify(notificationTargets),
    });
    return id;
  },

  async update(id, updates) {
    if (updates.allowedCreateRoles) 
      updates.allowedCreateRoles = JSON.stringify(updates.allowedCreateRoles);
    if (updates.allowedWriteRoles) 
      updates.allowedWriteRoles = JSON.stringify(updates.allowedWriteRoles);
    if (updates.notificationTargets) 
      updates.notificationTargets = JSON.stringify(updates.notificationTargets);
    return CalendarEventType.update(id, updates);
  },

  async getTypesForRole(role) {
    const all = await this.getAll(true);
    return all.filter(type => {
      const createRoles = JSON.parse(type.allowed_create_roles || '[]');
      const writeRoles = JSON.parse(type.allowed_write_roles || '[]');
      return createRoles.includes(role) || writeRoles.includes(role);
    });
  },

  async getTypesForRoleFiltered(role, filter = {}) {
    const types = await this.getTypesForRole(role);
    if (filter.event_type_id) {
      return types.filter(t => t.id === filter.event_type_id);
    }
    return types;
  }
};
```

### 5.4 Core Service: `recurringEngine.js`

```javascript
// backend/src/services/recurringEngine.js
import RecurringRule from '../models/RecurringRule.js';
import CalendarEvent from '../models/CalendarEvent.js';

export const recurringEngine = {
  async createRule(parentEventId, ruleData) {
    const { frequency, interval, endDate, maxOccurrences, daysOfWeek, dayOfMonth } = ruleData;
    
    const ruleId = crypto.randomUUID();
    await RecurringRule.create({
      id: ruleId,
      event_id: parentEventId,
      frequency,
      interval: interval || 1,
      days_of_week: daysOfWeek ? JSON.stringify(daysOfWeek) : null,
      day_of_month: dayOfMonth || null,
      end_date: endDate || null,
      max_occurrences: maxOccurrences || null,
      next_occurrence: this.calculateNextOccurrence(frequency, interval, daysOfWeek, dayOfMonth),
    });

    // Generate instances up to 90 days or end_date
    await this.generateInstances(parentEventId, ruleId, endDate, maxOccurrences);

    return ruleId;
  },

  async generateInstances(parentEventId, ruleId, endDate, maxOccurrences) {
    const rule = await RecurringRule.findById(ruleId);
    const parent = await CalendarEvent.findById(parentEventId);
    
    if (!rule || !parent) return;

    const instances = [];
    let currentDate = new Date(parent.start_time);
    let count = 0;
    const maxDate = endDate ? new Date(endDate) : new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000);

    while (currentDate <= maxDate && (!maxOccurrences || count < maxOccurrences)) {
      if (this.shouldGenerateInstance(currentDate, rule)) {
        const instanceId = crypto.randomUUID();
        const startShift = currentDate.getTime() - new Date(parent.start_time).getTime();
        
        instances.push({
          id: instanceId,
          parent_event_id: parentEventId,
          recurring_rule_id: ruleId,
          title: parent.title,
          description: parent.description,
          event_type: parent.event_type,
          assigned_users: parent.assigned_users,
          location: parent.location,
          is_all_day: parent.is_all_day,
          start_time: new Date(new Date(parent.start_time).getTime() + startShift),
          end_time: new Date(new Date(parent.end_time).getTime() + startShift),
          status: 'scheduled',
          index_key: `${parentEventId}_${currentDate.toISOString().split('T')[0]}`,
          parent_event_id: parentEventId,
        });
        count++;
      }
      
      currentDate = this.nextDate(currentDate, rule);
    }

    // Bulk insert instances (uses CalendarEvent.create for each)
    for (const instance of instances) {
      await CalendarEvent.create(instance);
    }

    await RecurringRule.update(ruleId, { 
      instance_count: count, 
      next_occurrence: currentDate 
    });

    return instances;
  },

  shouldGenerateInstance(date, rule) {
    if (rule.frequency === 'WEEKLY' && rule.days_of_week) {
      const days = JSON.parse(rule.days_of_week);
      return days.includes(date.getDay());
    }
    if (rule.frequency === 'MONTHLY' && rule.day_of_month) {
      return date.getDate() === rule.day_of_month;
    }
    return true;
  },

  nextDate(current, rule) {
    const next = new Date(current);
    switch (rule.frequency) {
      case 'DAILY': next.setDate(next.getDate() + (rule.interval || 1)); break;
      case 'WEEKLY': next.setDate(next.getDate() + 7 * (rule.interval || 1)); break;
      case 'MONTHLY': next.setMonth(next.getMonth() + (rule.interval || 1)); break;
      case 'YEARLY': next.setFullYear(next.getFullYear() + (rule.interval || 1)); break;
    }
    return next;
  },

  calculateNextOccurrence(frequency, interval, daysOfWeek, dayOfMonth) {
    const now = new Date();
    switch (frequency) {
      case 'DAILY': now.setDate(now.getDate() + interval); break;
      case 'WEEKLY': now.setDate(now.getDate() + 7 * interval); break;
      case 'MONTHLY': now.setMonth(now.getMonth() + interval); break;
      case 'YEARLY': now.setFullYear(now.getFullYear() + interval); break;
    }
    return now;
  },

  async skipInstance(eventId, date) {
    const event = await CalendarEvent.findById(eventId);
    if (!event) return;
    const cancelled = event.cancelled_instance_dates ? JSON.parse(event.cancelled_instance_dates) : [];
    if (!cancelled.includes(date)) {
      cancelled.push(date);
      await CalendarEvent.update(eventId, { cancelled_instance_dates: JSON.stringify(cancelled) });
    }
  }
};
```

### 5.5 Core Service: `notificationRouter.js`

```javascript
// backend/src/services/notificationRouter.js
import { broadcastToRole, broadcastToUser } from './socketService.js';

export const notificationRouter = {
  async route(eventType, eventData, createdByUserId, createdByRole) {
    // Get event type's notification targets from DB
    const eventTypeConfig = await this.getEventTypeConfig(eventType);
    
    if (eventTypeConfig && eventTypeConfig.notification_targets) {
      const targets = JSON.parse(eventTypeConfig.notification_targets);
      
      // Always notify the creator
      const notifiedUsers = new Set();
      broadcastToUser(createdByUserId, `calendar:${eventType}`, eventData);
      notifiedUsers.add(createdByUserId);

      // Notify each target role
      for (const role of targets) {
        if (role === 'SELF') {
          // Already handled above
        } else if (role === 'CREATOR_ROLE') {
          broadcastToRole(createdByRole, `calendar:${eventType}`, eventData);
        } else {
          broadcastToRole(role, `calendar:${eventType}`, eventData);
        }
      }
    } else {
      // Fallback: notify creator's role only
      broadcastToRole(createdByRole, `calendar:${eventType}`, eventData);
    }
  },

  async getEventTypeConfig(eventTypeId) {
    // Query calendar_event_types table
    const { default: CalendarEventType } = await import('../models/CalendarEventType.js');
    return CalendarEventType.findById(eventTypeId);
  }
};
```

### 5.6 Enhanced Controller: `calendarController.js`

```javascript
// Key changes to existing controller:
// 1. Replace broadcastToRole('HR', ...) with notificationRouter.route(...)
// 2. Add role-aware filtering in listEvents
// 3. Add event_type_id parameter support
// 4. Add assigned_to parameter for cross-role visibility

export const listEvents = asyncHandler(async (req, res) => {
  const { start_date, end_date, event_type, created_by, event_type_id, 
          assigned_to, page = 1, limit = 50, role } = req.query;
  // role-aware filtering: if assigned_to is set, filter by assigned users
  // if event_type_id is set, filter by type
  // if no params, filter by user's role permissions
  
  const userRole = req.user.role;
  const userRoleConfig = await getRoleCalendarConfig(userRole);
  
  // Build query based on role config
  const filters = { start_date, end_date };
  
  if (event_type_id) filters.event_type_id = event_type_id;
  if (created_by) filters.created_by = created_by;
  if (assigned_to) filters.assigned_users = { contains: assigned_to };
  
  // If role has visibility restrictions, apply them
  if (userRoleConfig && userRoleConfig.event_type_visibility && 
      userRoleConfig.event_type_visibility.length > 0) {
    filters.event_type_ids = userRoleConfig.event_type_visibility;
  }
  
  const [items, countRow] = await Promise.all([
    CalendarEvent.list({ ...filters, limit: parseInt(limit), offset: (parseInt(page)-1)*parseInt(limit) }),
    CalendarEvent.count(filters)
  ]);
  
  return success(res, 200, items, 'Calendar events retrieved', {
    page: parseInt(page), limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createEvent = asyncHandler(async (req, res) => {
  const { event_type_id, ...eventData } = req.body;
  
  // Validate event type is allowed for this role
  if (event_type_id) {
    const typeConfig = await eventTypeService.getById(event_type_id);
    if (!typeConfig) throw new ValidationError('Invalid event type');
    const allowed = JSON.parse(typeConfig.allowed_create_roles || '[]');
    if (!allowed.includes(req.user.role) && req.user.role !== ROLES.SUPER_ADMIN) {
      throw new AuthorizationError('Your role cannot create this event type');
    }
  }
  
  const id = await CalendarEvent.create({ 
    ...eventData, 
    created_by: req.user.id, 
    event_type_id 
  });
  
  await AuditLog.create({ ... }); // existing
  
  // Dynamic notification routing
  await notificationRouter.route(event_type_id || req.body.event_type, id, req.user.id, req.user.role);
  
  return success(res, 201, { id }, 'Event created successfully');
});
```

### 5.7 Enhanced Model: `CalendarEvent.js`

```javascript
// Key additions to CalendarEvent model:

static async list({ start_date, end_date, event_type, created_by, event_type_id, 
                    assigned_to, role, limit = 50, offset = 0 } = {}) {
  let query = 'SELECT * FROM calendar_events WHERE 1=1';
  const values = [];

  if (start_date && end_date) { query += ' AND start_time BETWEEN ? AND ?'; values.push(start_date, end_date); }
  if (event_type) { query += ' AND event_type = ?'; values.push(event_type); }
  if (event_type_id) { query += ' AND event_type_id = ?'; values.push(event_type_id); }
  if (created_by) { query += ' AND created_by = ?'; values.push(created_by); }
  if (assigned_to) { query += ' AND JSON_CONTAINS(assigned_users, ?)'; values.push(JSON.stringify([assigned_to])); }
  // Filter out cancelled instances
  query += ' AND (cancelled_instance_dates IS NULL OR cancelled_instance_dates = "[]")';
  query += ' AND (parent_event_id IS NULL OR parent_event_id = "")'; // show parents, not generated instances by default
  query += ' ORDER BY start_time ASC LIMIT ? OFFSET ?';
  values.push(limit, offset);
  
  const [rows] = await pool.execute(query, values);
  return rows.map(row => this.format(row));
}

// NEW: Expand recurring events for a date range
static async listExpanded({ start_date, end_date, event_type_id, role, limit = 50, offset = 0 } = {}) {
  // 1. Get parent events that recur within range
  // 2. Get generated instances that fall within range
  // 3. Merge and deduplicate, excluding cancelled instances
  // Returns combined list of static + expanded recurring events
}
```

### 5.8 New Routes

```javascript
// backend/src/routes/eventTypeRoutes.js
router.get('/calendar/types', authenticate, listEventTypes);           // ALL authenticated roles
router.get('/calendar/types/:id', authenticate, getEventType);          // ALL authenticated roles
router.post('/calendar/types', authenticate, requireRole('ADMIN','SUPER_ADMIN'), validateBody('createEventType'), createEventType);
router.patch('/calendar/types/:id', authenticate, requireRole('ADMIN','SUPER_ADMIN'), validateBody('createEventType'), updateEventType);
router.delete('/calendar/types/:id', authenticate, requireRole('ADMIN','SUPER_ADMIN'), deleteEventType);

// backend/src/routes/recurringRoutes.js
router.post('/calendar/events/:id/recur', authenticate, createRecurrence);   // roles with calendar:write
router.post('/calendar/events/:id/instances', authenticate, getInstances);     // roles with calendar:read
router.post('/calendar/instances/:id/skip', authenticate, skipInstance);       // roles with calendar:write
router.post('/calendar/instances/:id/cancel', authenticate, cancelInstance);   // roles with calendar:write

// backend/src/routes/calendarRoleConfigRoutes.js
router.get('/calendar/config', authenticate, getRoleConfig);            // authenticated roles
router.patch('/calendar/config', authenticate, requireRole('ADMIN','SUPER_ADMIN'), updateRoleConfig); // admin only
```

---

## 6. Frontend Implementation

### 6.1 Enhanced Redux Store: `calendarSlice.js`

```javascript
const initialState = {
  events: [],
  expandedEvents: [],     // includes recurring instances
  loading: false,
  error: null,
  filters: {
    startDate: null,
    endDate: null,
    eventTypeId: null,
    assignedTo: null,
    searchQuery: '',
  },
  viewMode: 'month',      // 'day' | 'week' | 'month' | 'agenda'
  selectedDate: new Date(),
  eventTypes: [],          // role-specific types
  roleConfig: null,        // per-role calendar config
  recurringRule: null,     // active recurrence rule being configured
};

// New actions:
// setFilters, setViewMode, setSelectedDate, 
// fetchEventTypes, fetchRoleConfig, 
// createEventWithType, createRecurringEvent, skipInstance, cancelInstance,
// expandRecurringEvents
```

### 6.2 New API Client: `calendarEventTypeApi.js`

```javascript
export const eventTypeApi = {
  getAll: () => axiosInstance.get('/v1/calendar/types'),
  getById: (id) => axiosInstance.get(`/v1/calendar/types/${id}`),
  create: (data) => axiosInstance.post('/v1/calendar/types', data),
  update: (id, data) => axiosInstance.patch(`/v1/calendar/types/${id}`, data),
  delete: (id) => axiosInstance.delete(`/v1/calendar/types/${id}`),
};

export const recurringApi = {
  createRule: (eventId, ruleData) => 
    axiosInstance.post(`/v1/calendar/events/${eventId}/recur`, ruleData),
  getInstances: (eventId, params) => 
    axiosInstance.get(`/v1/calendar/events/${eventId}/instances`, { params }),
  skipInstance: (instanceId) => 
    axiosInstance.post(`/v1/calendar/instances/${instanceId}/skip`),
  cancelInstance: (instanceId) => 
    axiosInstance.post(`/v1/calendar/instances/${instanceId}/cancel`),
};

export const roleConfigApi = {
  getConfig: () => axiosInstance.get('/v1/calendar/config'),
  updateConfig: (data) => axiosInstance.patch('/v1/calendar/config', data),
};
```

### 6.3 New Components

#### CalendarPage.jsx — Main Dynamic Calendar

```
Layout: Header with role-title, view toggles (Day/Week/Month/Agenda), date navigator, "New Event" button
Left Panel: Mini month view + event type filter (checkboxes for role's allowed types)
Center: Active view (day/week/month/agenda) rendered based on viewMode
  - Day: hourly timeline
  - Week: 7-column grid
  - Month: grid with event dots
  - Agenda: chronological list
Right Panel: Selected event details / quick-create form
Bottom: Recurring event indicator (repeating icon), status badges
```

#### EventTypeAdmin.jsx — Admin Panel

```
Table of all event types with:
- Label, Icon, Color, Default Duration
- Allowed Create Roles (chips/tags)
- Allowed Write Roles (chips/tags)
- Notification Targets (chips/tags)
- Active toggle
- Quick Create: Add new type form (modal)
- Edit type form (modal with role multi-select dropdowns)
- Accessible only to ADMIN/SUPER_ADMIN
```

#### RecurringConfig.jsx — Recurrence Setup

```
Modal triggered from event form "Make Recurring" toggle:
- Frequency: Daily | Weekly | Monthly | Yearly (radio)
- Interval: every N (number input)
- Days of Week: checkboxes (when Weekly)
- Day of Month: number input (when Monthly)
- End Date: date picker OR occurrence count
- Preview: shows next 5 instances before saving
- Save creates parent event + rule + instances
```

### 6.4 Navigation Changes

Add to `backend/src/config/navigationConfig.js`:
- **ADMIN**: Add "Calendar" under Operations
- **TUTOR**: Add "Calendar" under Academics
- **SALES**: Add "Calendar" under Activities
- **STUDENT**: Add "Calendar" under Learning

---

## 7. Permission Updates (constants.js)

```javascript
// Add to each role's permission list as needed:
FINANCE: [
  ...existing,
  'calendar:read', 'calendar:write',     // Currently missing entirely
],
SALES: [
  ...existing,
  'calendar:write',                      // Currently read-only
],
TUTOR: [
  ...existing,
  'calendar:write',                      // Currently read-only
],
EMPLOYEE: [
  ...existing,
  // Already has calendar:read
],
STUDENT: [
  ...existing,
  // Already has calendar:read
],
INTERN: [
  ...existing,
  // Already has calendar:read
],
```

New permission to add to ADMIN/SUPER_ADMIN:
```javascript
'calendar:manage_types',   // manage event type definitions
'calendar:manage_recurring', // manage recurrence rules
```

---

## 8. Integration Points

### 8.1 Interview → Calendar Integration

```javascript
// backend/src/controllers/interviewController.js (or hook)
// When an interview is scheduled, also create a calendar event:

async function scheduleInterview(interviewData) {
  // 1. Create interview record (existing)
  const interview = await Interview.create(interviewData);
  
  // 2. Find event type "Interview"
  const interviewType = await CalendarEventType.findByType('evt_interview');
  
  // 3. Create calendar event linked to interview
  await CalendarEvent.create({
    title: `Interview: ${interview.candidate_name} - ${interview.round}`,
    description: `Interview round ${interview.round} with ${interview.interviewer_name}`,
    event_type: 'INTERVIEW',
    event_type_id: interviewType.id,
    start_time: interview.scheduled_at,
    end_time: new Date(new Date(interview.scheduled_at).getTime() + interview.duration_minutes * 60000),
    assigned_users: [interview.interviewer_id, interview.candidate_id],
    created_by: interview.interviewer_id,
  });
  
  // 4. Notify via dynamic routing
  await notificationRouter.route(interviewType.id, interview.id, 'HR', 'HR');
}
```

### 8.2 Leave → Calendar Integration

```javascript
// When leave is approved/rejected/created:
async function onLeaveChange(leaveData) {
  const leaveType = await CalendarEventType.findByType('evt_leave');
  if (leaveType) {
    await CalendarEvent.create({
      title: `Leave: ${leaveData.reason}`,
      event_type: 'LEAVE',
      event_type_id: leaveType.id,
      start_time: leaveData.start_date,
      end_time: leaveData.end_date,
      user_id: leaveData.user_id,
      created_by: leaveData.user_id,
      status: leaveData.status === 'APPROVED' ? 'scheduled' : 'cancelled',
    });
  }
}
```

### 8.3 Scheduled Reports → Calendar Integration

```javascript
// When a scheduled report is created/updated/run:
async function onScheduleChange(scheduleData) {
  const reportType = await CalendarEventType.findByType('evt_payment');
  if (reportType && scheduleData.next_send_at) {
    await CalendarEvent.create({
      title: `Report: ${scheduleData.report_name}`,
      event_type: 'PAYMENT',
      event_type_id: reportType.id,
      start_time: scheduleData.next_send_at,
      created_by: scheduleData.created_by,
      recurrence_rule: JSON.stringify({
        frequency: scheduleData.frequency,
        interval: 1,
      }),
    });
  }
}
```

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1-2)

- [ ] Create `calendar_event_types` table + migration script
- [ ] Create `calendar_role_configs` table + migration script
- [ ] Create `recurring_rules` table + migration script
- [ ] Implement `CalendarEventType` model + CRUD
- [ ] Implement `CalendarRoleConfig` model + CRUD
- [ ] Implement `RecurringRule` model + basic CRUD
- [ ] Create EventType controller + routes (admin-only)
- [ ] Create RoleConfig controller + routes
- [ ] Seed 12 default event types
- [ ] Seed role configs for all 13 roles
- [ ] Add `calendar:manage_types` and `calendar:manage_recurring` permissions
- [ ] Add `calendar:write` to FINANCE, SALES, TUTOR permissions

### Phase 2: Recurring Engine (Week 3)

- [ ] Implement `recurringEngine` service (RRULE expansion)
- [ ] Add `recurringEngine` endpoints to routes
- [ ] Enhance `CalendarEvent.list()` with `event_type_id`, `assigned_to`, `status` filters
- [ ] Implement `listExpanded()` for recurring instance views
- [ ] Add cancellation/skip endpoints
- [ ] Add `parent_event_id` and `cancelled_instance_dates` fields
- [ ] Write unit tests for recurrence calculation

### Phase 3: Notification Router (Week 4)

- [ ] Implement `notificationRouter` service
- [ ] Replace all `broadcastToRole('HR', ...)` in calendarController with router
- [ ] Add `broadcastToUser` for creator notification
- [ ] Verify all calendar operations route correctly per event type
- [ ] Add role-aware socket events (client subscribes to `calendar:EVENT_TYPE`)

### Phase 4: Frontend Calendar UI (Week 5-6)

- [ ] Enhance `calendarSlice` with filters, types, configs, view modes
- [ ] Create `calendarApi` client (listByRole, getTypes, getRoleConfig, expandRecurring)
- [ ] Build `CalendarPage.jsx` (month/week/day/agenda views)
- [ ] Build `EventForm.jsx` (dynamic based on role's allowed types)
- [ ] Build `RecurringConfig.jsx` (recurrence modal)
- [ ] Build `EventTypeAdmin.jsx` (admin panel for types)
- [ ] Add Calendar nav items to ADMIN, TUTOR, SALES, STUDENT
- [ ] Implement view persistence in `calendarRoleConfig`

### Phase 5: Integrations (Week 7)

- [ ] Interview → Calendar auto-create
- [ ] Leave → Calendar auto-create
- [ ] Scheduled Report → Calendar auto-create
- [ ] Cross-role event visibility (assigned users see event)
- [ ] Audit log all calendar operations (existing, enhanced)
- [ ] End-to-end testing across all roles

### Phase 6: Polish (Week 8)

- [ ] Performance optimization (indexes, query tuning)
- [ ] Error handling and edge cases
- [ ] Accessibility improvements
- [ ] Documentation

---

## 10. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Event types stored in DB, not hardcoded | Enables dynamic addition without code changes |
| Recurring instances pre-generated | Faster queries, easier cancellation, simpler pagination |
| Notification targets per event type | Eliminates universal HR broadcast, enables role-relevant alerts |
| Parent events excluded from default list | Avoids duplication with generated instances; toggle to show all |
| Role config table | Each role can customize calendar title, default view, work hours, visible types |
| `calendar:write` for FINANCE/SALES/TUTOR | Their responsibilities require scheduling capability |
| Interview/Leave/Report integration | Consolidates scheduling across all systems into one calendar |

---

## 11. API Endpoints Summary

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/v1/calendar/events` | List events (role-aware) | All authenticated |
| POST | `/v1/calendar/events` | Create event | Roles per event type config |
| GET | `/v1/calendar/events/:id` | Get single event | Read-permitted roles |
| PATCH | `/v1/calendar/events/:id` | Update event | Write-permitted roles |
| DELETE | `/v1/calendar/events/:id` | Delete event | Write + delete permitted |
| GET | `/v1/calendar/types` | List event types | All authenticated |
| POST | `/v1/calendar/types` | Create event type | ADMIN, SUPER_ADMIN |
| PATCH | `/v1/calendar/types/:id` | Update event type | ADMIN, SUPER_ADMIN |
| DELETE | `/v1/calendar/types/:id` | Delete event type | ADMIN, SUPER_ADMIN |
| POST | `/v1/calendar/events/:id/recur` | Create recurrence rule | calendar:write roles |
| GET | `/v1/calendar/events/:id/instances` | List recurring instances | calendar:read roles |
| POST | `/v1/calendar/instances/:id/skip` | Skip instance | calendar:write roles |
| POST | `/v1/calendar/instances/:id/cancel` | Cancel instance | calendar:write roles |
| GET | `/v1/calendar/config` | Get role calendar config | All authenticated |
| PATCH | `/v1/calendar/config` | Update role calendar config | ADMIN, SUPER_ADMIN |
| GET | `/v1/calendar/expand` | Expand recurring events in range | All authenticated |

---

## 12. Testing Strategy

### Unit Tests
- Recurring engine date calculations (daily/weekly/monthly/yearly)
- Event type permission validation (create/write/read per role)
- Notification routing (correct roles notified per event type)
- Instance cancellation/skip logic
- Date range filtering with exclusions

### Integration Tests
- Interview scheduling → calendar event creation
- Leave approval → calendar event update
- Report schedule → calendar event linkage
- Cross-role event visibility (user A assigned to user B's event)

### Role-Based Tests
- Each of 13 roles: can/cannot create each event type
- Each of 13 roles: sees correct event subset
- Each of 13 roles: receives correct notifications
- Permission edge cases (SUPER_ADMIN bypass, role config overrides)

---

## 13. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Recurring engine edge cases (Feb 29, timezone) | High | Test with known edge dates; use UTC internally |
| Performance with 1000+ recurring instances | Medium | Limit pre-generation to 90 days; index on parent_event_id |
| Notification storm on bulk operations | Medium | Rate-limit broadcasts; use `broadcastToUser` for targeted |
| Breaking existing calendar API | Low | Maintain backward compatibility; new fields optional |
| FINANCE/SALES write permission security risk | Medium | Granular event type permissions restrict what they can create |

---

## 14. Success Criteria

- [ ] Every role has a visible, functional Calendar page
- [ ] Every role can create at least one type of event relevant to their duties
- [ ] Recurring events generate instances correctly for all frequencies
- [ ] Notifications reach only relevant roles per event type
- [ ] FINANCE, SALES, STUDENT, TUTOR, EMPLOYEE, INTERN have write access
- [ ] ADMIN, SUPER_ADMIN can manage event types dynamically
- [ ] Interviews, Leaves, and Scheduled Reports appear on calendars
- [ ] No calendar operation broadcasts universally to HR
- [ ] All 13 roles have per-role calendar configuration
- [ ] End-to-end test passes for all roles
