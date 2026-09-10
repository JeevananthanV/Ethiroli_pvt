import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  jobs: [],
  loading: false,
  error: null,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload
    },
    addJob: (state, action) => {
      state.jobs.push(action.payload)
    },
    updateJob: (state, action) => {
      const index = state.jobs.findIndex((j) => j.id === action.payload.id)
      if (index !== -1) {
        state.jobs[index] = action.payload
      }
    },
    removeJob: (state, action) => {
      state.jobs = state.jobs.filter((j) => j.id !== action.payload)
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
  setJobs,
  addJob,
  updateJob,
  removeJob,
  setLoading,
  setError,
} = jobsSlice.actions

export default jobsSlice.reducer
