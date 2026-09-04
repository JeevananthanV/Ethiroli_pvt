import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSession: null,
  leaderboard: [],
  loading: false,
  error: null
};

const liveQuizSlice = createSlice({
  name: 'liveQuiz',
  initialState,
  reducers: {
    setLiveQuizSession: (state, action) => { state.activeSession = action.payload; },
    updateLeaderboard: (state, action) => { state.leaderboard = action.payload; }
  }
});

export const { setLiveQuizSession, updateLeaderboard } = liveQuizSlice.actions;
export default liveQuizSlice.reducer;
