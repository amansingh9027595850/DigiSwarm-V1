import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar: (state, { payload }) => {
      state.sidebarOpen = payload;
    },
    setTheme: (state, { payload }) => {
      state.theme = payload;
    },
  },
});

export const { toggleSidebar, setSidebar, setTheme } = uiSlice.actions;

export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;

export default uiSlice.reducer;
