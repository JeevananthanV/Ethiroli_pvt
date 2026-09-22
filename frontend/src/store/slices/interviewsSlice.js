import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  interviews: [],
  loading: false,
  error: null,
}

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    setInterviews: (state, action) => {
      state.interviews = action.payload
    },
    addInterview: (state, action) => {
      state.interviews.push(action.payload)
    },
    updateInterview: (state, action) => {
      const index = state.interviews.findIndex((i) => i.id === action.payload.id)
      if (index !== -1) {
        state.interviews[index] = action.payload
      }
    },
    removeInterview: (state, action) => {
      state.interviews = state.interviews.filter((i) => i.id !== action.payload)
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
  setInterviews,
  addInterview,
  updateInterview,
  removeInterview,
  setLoading,
  setError,
} = interviewsSlice.actions

export default interviewsSlice.reducer
