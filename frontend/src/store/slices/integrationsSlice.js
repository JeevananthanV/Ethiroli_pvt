import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  integrations: [],
  loading: false,
  error: null,
}

const integrationsSlice = createSlice({
  name: 'integrations',
  initialState,
  reducers: {
    setIntegrations: (state, action) => {
      state.integrations = action.payload
    },
    addIntegration: (state, action) => {
      state.integrations.push(action.payload)
    },
    updateIntegration: (state, action) => {
      const index = state.integrations.findIndex((i) => i.id === action.payload.id)
      if (index !== -1) {
        state.integrations[index] = action.payload
      }
    },
    removeIntegration: (state, action) => {
      state.integrations = state.integrations.filter((i) => i.id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setIntegrations,
  addIntegration,
  updateIntegration,
  removeIntegration,
  setLoading,
  setError,
} = integrationsSlice.actions

export default integrationsSlice.reducer
