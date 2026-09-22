import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  courses: [],
  loading: false,
  error: null,
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload)
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.courses[index] = action.payload
      }
    },
    removeCourse: (state, action) => {
      state.courses = state.courses.filter((c) => c.id !== action.payload)
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
  setCourses,
  addCourse,
  updateCourse,
  removeCourse,
  setLoading,
  setError,
} = coursesSlice.actions

export default coursesSlice.reducer
