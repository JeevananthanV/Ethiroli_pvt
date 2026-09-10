import { configureStore } from '@reduxjs/toolkit'
import integrationsReducer from './slices/integrationsSlice'
import interviewsReducer from './slices/interviewsSlice'
import jobsReducer from './slices/jobsSlice'
import coursesReducer from './slices/coursesSlice'

const store = configureStore({
  reducer: {
    integrations: integrationsReducer,
    interviews: interviewsReducer,
    jobs: jobsReducer,
    courses: coursesReducer,
  },
})

export { store }
export default store
