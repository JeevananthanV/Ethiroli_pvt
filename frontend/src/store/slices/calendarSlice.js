import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import calendarApi from '../../services/calendarApi.js';

export const fetchRoleConfig = createAsyncThunk(
  'calendar/fetchRoleConfig',
  async (_, { rejectWithValue }) => {
    try {
      return await calendarApi.getRoleConfig();
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch role calendar configuration');
    }
  }
);

export const fetchAllowedTypes = createAsyncThunk(
  'calendar/fetchAllowedTypes',
  async (_, { rejectWithValue }) => {
    try {
      return await calendarApi.listAllowedTypes();
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch allowed event types');
    }
  }
);

export const fetchExpandedEvents = createAsyncThunk(
  'calendar/fetchExpandedEvents',
  async ({ start, end, event_type_id }, { rejectWithValue }) => {
    try {
      return await calendarApi.listExpanded({ start, end, event_type_id });
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch calendar events in range');
    }
  }
);

export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (params = { page: 1, limit: 50 }, { rejectWithValue }) => {
    try {
      return await calendarApi.listEvents(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch events');
    }
  }
);

export const createEventThunk = createAsyncThunk(
  'calendar/createEvent',
  async (data, { rejectWithValue }) => {
    try {
      return await calendarApi.createEvent(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create event');
    }
  }
);

export const updateEventThunk = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await calendarApi.updateEvent(id, data);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update event');
    }
  }
);

export const deleteEventThunk = createAsyncThunk(
  'calendar/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await calendarApi.deleteEvent(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete event');
    }
  }
);

export const skipInstanceThunk = createAsyncThunk(
  'calendar/skipInstance',
  async ({ parentEventId, date }, { rejectWithValue }) => {
    try {
      await calendarApi.skipInstance(parentEventId, date);
      return { parentEventId, date };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to skip instance');
    }
  }
);

export const cancelInstanceThunk = createAsyncThunk(
  'calendar/cancelInstance',
  async (instanceId, { rejectWithValue }) => {
    try {
      await calendarApi.cancelInstance(instanceId);
      return instanceId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel instance');
    }
  }
);

const initialState = {
  events: [],
  expandedEvents: [],
  allowedTypes: [],
  roleConfig: null,
  viewMode: 'month', // 'month' | 'week' | 'day' | 'agenda'
  currentDate: new Date().toISOString(),
  selectedEventType: 'ALL',
  selectedEvent: null,
  searchQuery: '',
  loading: false,
  typesLoading: false,
  configLoading: false,
  actionLoading: false,
  error: null,
  totalEvents: 0,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
    setSelectedEventType: (state, action) => {
      state.selectedEventType = action.payload;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Role Config
      .addCase(fetchRoleConfig.pending, (state) => {
        state.configLoading = true;
      })
      .addCase(fetchRoleConfig.fulfilled, (state, action) => {
        state.configLoading = false;
        state.roleConfig = action.payload;
        if (action.payload?.default_view) {
          state.viewMode = action.payload.default_view;
        }
      })
      .addCase(fetchRoleConfig.rejected, (state, action) => {
        state.configLoading = false;
        state.error = action.payload;
      })

      // Allowed Types
      .addCase(fetchAllowedTypes.pending, (state) => {
        state.typesLoading = true;
      })
      .addCase(fetchAllowedTypes.fulfilled, (state, action) => {
        state.typesLoading = false;
        state.allowedTypes = action.payload;
      })
      .addCase(fetchAllowedTypes.rejected, (state, action) => {
        state.typesLoading = false;
        state.error = action.payload;
      })

      // Expanded Range Events
      .addCase(fetchExpandedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpandedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.expandedEvents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchExpandedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Paginated Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        state.events = Array.isArray(res) ? res : (res?.data || res?.events || []);
        state.totalEvents = res?.total || state.events.length;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Event
      .addCase(createEventThunk.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createEventThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const newEvt = action.payload?.event || action.payload;
        if (newEvt) {
          state.events.unshift(newEvt);
          state.expandedEvents.push(newEvt);
        }
      })
      .addCase(createEventThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Delete Event
      .addCase(deleteEventThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const id = action.payload;
        state.events = state.events.filter(e => e.id !== id);
        state.expandedEvents = state.expandedEvents.filter(e => e.id !== id && e.parent_event_id !== id);
      })

      // Skip Instance
      .addCase(skipInstanceThunk.fulfilled, (state, action) => {
        const { parentEventId, date } = action.payload;
        state.expandedEvents = state.expandedEvents.filter(
          e => !(e.parent_event_id === parentEventId && e.start_time?.startsWith(date))
        );
      })

      // Cancel Instance
      .addCase(cancelInstanceThunk.fulfilled, (state, action) => {
        const instanceId = action.payload;
        state.expandedEvents = state.expandedEvents.filter(e => e.id !== instanceId);
      });
  },
});

export const {
  setViewMode,
  setCurrentDate,
  setSelectedEventType,
  setSelectedEvent,
  setSearchQuery,
  clearError
} = calendarSlice.actions;

export default calendarSlice.reducer;
