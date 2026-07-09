import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  // Becomes true once AuthBootstrap finishes its background refresh attempt.
  // ProtectedRoute uses this to know whether "not authenticated" is final
  // or just "still checking".
  authChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
      state.isAuthenticated = !!payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    },
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
    setAuthChecked: (state, { payload }) => {
      state.authChecked = payload;
    },
  },
});

export const { setUser, clearAuth, setStatus, setAuthChecked } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthChecked = (state) => state.auth.authChecked;
export const selectUserRole = (state) => state.auth.user?.role?.name ?? null;

export default authSlice.reducer;
