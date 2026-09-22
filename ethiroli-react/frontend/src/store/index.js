import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import leadsReducer from './slices/leadsSlice'
import feedReducer from './slices/feedSlice'
import integrationsReducer from './slices/integrationsSlice'
import interviewsReducer from './slices/interviewsSlice'
import jobsReducer from './slices/jobsSlice'
import coursesReducer from './slices/coursesSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    leads: leadsReducer,
    feed: feedReducer,
    integrations: integrationsReducer,
    interviews: interviewsReducer,
    jobs: jobsReducer,
    courses: coursesReducer,
  },
})

export { store }
export default store
